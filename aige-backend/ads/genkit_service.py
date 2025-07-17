import os
import json
import google.generativeai as genai
from .flow_preprocess import preprocess_flow_for_script

# Configure Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def generate_structured_ad_script(config: dict, flow: dict) -> str:
    """
    Generate structured scene-by-scene interactive ad script based on the selected template.
    Supported templates: 'choice-point', 'aige'
    Each scene must fit within 8 seconds of video and include Indian characters/dialogue.
    """
    characters_or_elements = config.get("characters_or_elements", "").strip()
    if not characters_or_elements:
        raise ValueError("Please specify at least one character or element.")

    # Preprocess node-flow into simplified structure
    preprocessed_flow = preprocess_flow_for_script(flow)
    flow_json = json.dumps(preprocessed_flow, ensure_ascii=False)

    template_type = config.get("template_type", "aige")

    if template_type == "choice-point":
        prompt = f"""
You are an expert interactive ad scriptwriter and narrative designer for AI-generated video ads.

Your task is to write a branching interactive ad script using the **Choice Point Template**.
Each scene will be rendered as an **AI-generated 9:16 video** (vertical aspect ratio), and must fit within **8 seconds**.

--- CONFIGURATION ---
Tone: {config.get("tone", "engaging")}
Brand Voice: {config.get("brandVoice", "friendly")}
Platform: {config.get("platform", "mobile")}
Language: {config.get("language", "english")}
Duration: {config.get("durationInSeconds", 30)} seconds
Theme: {config.get("theme_prompt", "")}
Characters/Elements: {characters_or_elements}

--- FLOW STRUCTURE ---
Opening Scene → Choice Point (non-video) → Scene A or Scene B

--- STYLE & DIALOGUE RULES ---
- Characters can be culturally neutral and natural (no forced Indianization).
- Dialogue must be prioritized in the script, designed for an AI + manual voiceover pipeline.
- Each scene must be visualized for a strict 9:16 aspect ratio and fit within ~8 seconds.
- Dialogue should be concise, spoken-style, and fit the time limit.

--- FLOW JSON ---
{flow_json}

--- OUTPUT FORMAT ---
Return a valid JSON array of **4 objects** in this order:
1. Opening Scene
2. Choice Point (not a scene)
3. Scene A
4. Scene B

For scenes (1, 3, 4), include:
- `scene_id` or `scene_title`
- `visual`: vivid, cinematic, 9:16 compatible, fits 8s
- `dialogue`: brief, spoken-friendly line (prioritize dialogue)
- `audio`: background or ambient music

For the choice point (2), include:
- `scene_id`: "choice_point"
- `description`: suspenseful moment of decision
- `option_a_text`, `option_b_text`
- `option_a_leads_to`, `option_b_leads_to`

⚠️ DO NOT include any additional scenes, games, AR filters.
⚠️ Must output raw valid JSON. No markdown or prose.
        """
    else:
        prompt = f"""
You are an expert interactive ad scriptwriter and narrative designer for AI-generated video ads.

Your task is to write a branching interactive script using the **AIGE Template**, where the choice is embedded inside the first scene.
Each scene will be rendered as an **AI-generated 9:16 video** (vertical aspect ratio), and must fit within **8 seconds**.

--- CONFIGURATION ---
Tone: {config.get("tone", "engaging")}
Brand Voice: {config.get("brandVoice", "friendly")}
Platform: {config.get("platform", "mobile")}
Language: {config.get("language", "english")}
Duration: {config.get("durationInSeconds", 30)} seconds
Theme: {config.get("theme_prompt", "")}
Characters/Elements: {characters_or_elements}

--- FLOW STRUCTURE ---
Opening Scene (with embedded choice) → Scene A or Scene B → Shared Game Scene → Final Scene

--- STYLE & DIALOGUE RULES ---
- Characters can be culturally neutral and natural (no forced Indianization).
- Dialogue must be prioritized in the script, designed for an AI + manual voiceover pipeline.
- Each scene must be visualized for a strict 9:16 aspect ratio and fit within ~8 seconds.
- Dialogue should be concise, spoken-style, and fit the time limit.

--- FLOW JSON ---
{flow_json}

--- OUTPUT FORMAT ---
Return a JSON array of **5 objects**, in this order:
1. Opening Scene (with embedded choice logic)
2. Scene A
3. Scene B
4. Shared Game Scene
5. Final Scene

Each object must include:
- `scene_id` or `scene_title`
- `visual`: cinematic, 9:16 compatible, fits 8s
- `dialogue`: brief, spoken-friendly line (prioritize dialogue)
- `audio`: music or ambient cues

The Opening Scene must also include:
- `post_scene_choice_prompt`: the line prompting a user decision
- `option_a_text`, `option_b_text`
- `option_a_leads_to`, `option_b_leads_to`

⚠️ No standalone choice nodes allowed.
⚠️ Only output raw JSON. No markdown or comments.
        """

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        script_text = response.text.strip()

        def fix_choice_points(script_json_str):
            try:
                parsed = json.loads(script_json_str)
                new_script = []
                last_scene = None
                for obj in parsed:
                    if obj.get("scene_title", "").lower().startswith("choice") or obj.get("scene_id", "").lower().startswith("choice"):
                        if not obj.get("visual") and last_scene:
                            last_scene.update({
                                k: v for k, v in obj.items()
                                if k.startswith("option_") or "prompt" in k
                            })
                        continue
                    new_script.append(obj)
                    last_scene = obj
                return json.dumps(new_script, ensure_ascii=False)
            except Exception:
                return script_json_str

        return fix_choice_points(script_text)

    except Exception as e:
        raise RuntimeError(f"Script generation failed: {str(e)}")

def call_genkit_script_generation(config: dict, flow: dict) -> str:
    """
    Wrapper for Django views to invoke Gemini structured script generation.
    """
    return generate_structured_ad_script(config, flow)
