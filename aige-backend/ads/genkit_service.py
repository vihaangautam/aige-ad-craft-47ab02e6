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
- Opening Scene → Choice Point → [Scene A or Scene B] → Game → Final Scene

--- STORY FLOW (JSON) ---
{flow_json}

The story flow is designed as a 5-node graph with branching logic. The user starts at an opening scene, then chooses between two options, each leading to a scene. Both branches then go through a mini-game and end in a final scene. Please ensure this structure is reflected exactly in the script. You must:
- Follow all branches after the opening scene
- Include all nodes (scene, game, or filter) that are connected via edges
- For nodes of type "game", create a standard scene object with:
    - `scene_id`: from the flow
    - `visual`: short description of the game experience
    - `dialogue`: immersive narration or user instruction
    - `audio`: ambient or themed music (e.g. arcade, timer, suspenseful)
- Even if a game node is not part of a choice, include it in the sequence between the previous and next nodes
- Ensure every valid connected path is covered: Opening → Choice → A/B Scene → Game → Final

--- OUTPUT INSTRUCTIONS ---
Return a JSON array of objects — one per scene (or scene + embedded choice). DO NOT return prose or markdown.

Each object must include:
- `scene_id` or `scene_title` (copied from the flow)
- `visual`: vivid, cinematic visuals for the video
- `dialogue`: character lines or narration
- `audio`: background music or sound effects

If the scene leads into a choice:
- Add:
    - `post_scene_choice_prompt`: suspenseful user-facing line
    - `option_a_text` and `option_b_text`: action-oriented, human-friendly labels
    - `option_a_leads_to` and `option_b_leads_to`: scene_ids for branching

DO NOT generate standalone scripts for nodes of type `choice_point`. Instead, embed their logic into the previous scene's JSON object.

⚠️ You must only use the provided characters or elements. Do not invent new ones.
⚠️ Output must be a **clean, valid JSON array**. No markdown, no explanation.

Begin. Output only the JSON array:
"""

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)

        # Return valid JSON response string
        return response.text.strip() if hasattr(response, "text") else str(response)

    except Exception as e:
        raise RuntimeError(f"Gemini structured script generation failed: {str(e)}")


def call_genkit_script_generation(config: dict, flow: dict) -> str:
    """
    Wrapper for Django views to invoke Gemini structured script generation.
    """
    return generate_structured_ad_script(config, flow)
