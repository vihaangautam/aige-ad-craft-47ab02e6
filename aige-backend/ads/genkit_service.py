import os
import json
import google.generativeai as genai
from .flow_preprocess import preprocess_flow_for_script

# Configure Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def generate_structured_ad_script(config: dict, flow: dict) -> str:
    """
    Generate a scene-by-scene, video-compatible interactive ad script in structured JSON using Gemini (Google GenAI).
    """

    characters_or_elements = config.get("characters_or_elements", "").strip()
    if not characters_or_elements:
        raise ValueError("No characters or elements specified. Please provide characters or elements for the story.")

    # Preprocess the flow to embed choice points into scenes
    preprocessed_flow = preprocess_flow_for_script(flow)
    flow_json = json.dumps(preprocessed_flow, ensure_ascii=False)

    prompt = f"""
You are an expert interactive ad scriptwriter and narrative designer for AI-generated video ads.

Your task is to generate a structured, scene-by-scene script for a branching, interactive video ad experience — not a linear video. Each scene will be rendered as an AI-generated video based on your script.

--- CONFIGURATION ---
Tone: {config.get("tone", "engaging")}
Brand Voice: {config.get("brandVoice", "friendly")}
Platform: {config.get("platform", "mobile")}
Language: {config.get("language", "english")}
Duration: {config.get("durationInSeconds", 30)} seconds
Theme: {config.get("theme_prompt", "")}
Characters/Elements: {characters_or_elements}
Story Flow Type: StaticTemplate6 (Scene → Choice → Scene A/B → Game → Final Scene)

--- FLOW SUMMARY ---
- Opening Scene (with embedded choice) → [Scene A or Scene B] → Shared Game → Final Scene

--- STORY FLOW (JSON) ---
{flow_json}

The story flow is designed as a 5-node graph with branching logic. The user starts at an opening scene, then chooses between two options, each leading to a scene. Both branches then go through the SAME mini-game and end in a final scene. Please ensure this structure is reflected exactly in the script. You must:
- The JSON array must have exactly 5 objects, in this order:
    1. Opening scene (with embedded choice logic)
    2. Scene A (for option A)
    3. Scene B (for option B)
    4. Shared game scene (same for both branches)
    5. Final scene
- The opening scene object must include all choice logic (post_scene_choice_prompt, option_a_text, option_b_text, option_a_leads_to, option_b_leads_to).
- DO NOT output any standalone objects of type 'choice_point', 'choice', or similar. All choice logic must be embedded in the opening scene object.
- For the shared game, use the same scene_id for both branches, and ensure both Scene A and Scene B lead to the same game scene.
- Ensure every valid connected path is covered: Opening → Choice → A/B Scene → Game → Final
- Only use the provided characters or elements. Do not invent new ones.

--- OUTPUT INSTRUCTIONS ---
Return a JSON array of objects — one per scene (or scene + embedded choice). DO NOT return prose or markdown.

Each object must include:
- `scene_id` or `scene_title` (copied from the flow)
- `visual`: vivid, cinematic visuals for the video
- `dialogue`: character lines or narration
- `audio`: background music or sound effects

If the scene leads into a choice (only the opening scene):
- Add:
    - `post_scene_choice_prompt`: suspenseful user-facing line
    - `option_a_text` and `option_b_text`: action-oriented, human-friendly labels
    - `option_a_leads_to` and `option_b_leads_to`: scene_ids for branching

⚠️ You must NOT generate standalone scripts for nodes of type `choice_point`, `choice`, or similar. Instead, embed their logic into the opening scene's JSON object.
⚠️ Output must be a **clean, valid JSON array**. No markdown, no explanation.

Begin. Output only the JSON array:
"""

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        script_text = response.text.strip() if hasattr(response, "text") else str(response)

        # --- POST-PROCESSING: Remove any stray choice_point nodes and embed their data into the preceding scene ---
        def fix_choice_points(script_json_str):
            import json
            try:
                arr = json.loads(script_json_str)
            except Exception:
                return script_json_str  # If not valid JSON, return as is
            new_arr = []
            last_scene = None
            for obj in arr:
                scene_id = obj.get("scene_id") or obj.get("scene_title")
                if scene_id and (scene_id.lower().startswith("choice") or obj.get("post_scene_choice_prompt")) and not obj.get("visual"):
                    # This is a stray choice_point node, merge into last_scene
                    if last_scene is not None:
                        last_scene.update({
                            k: v for k, v in obj.items() if k.startswith("option_") or k == "post_scene_choice_prompt"
                        })
                else:
                    new_arr.append(obj)
                    last_scene = obj
            return json.dumps(new_arr, ensure_ascii=False)

        script_text = fix_choice_points(script_text)
        return script_text

    except Exception as e:
        raise RuntimeError(f"Gemini structured script generation failed: {str(e)}")


def call_genkit_script_generation(config: dict, flow: dict) -> str:
    """
    Wrapper for Django views to invoke Gemini structured script generation.
    """
    return generate_structured_ad_script(config, flow)
