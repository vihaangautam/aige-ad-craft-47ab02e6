import os
import json
import google.generativeai as genai

# Configure API key
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def generate_structured_ad_script(config: dict, flow: dict) -> str:
    """
    Generate a scene-by-scene, video-compatible interactive ad script in structured JSON using Gemini (Google GenAI).
    """
    characters_or_elements = config.get("characters_or_elements", "").strip()
    if not characters_or_elements:
        raise ValueError("No characters or elements specified. Please provide characters or elements for the story.")

    prompt = f"""
You are an expert interactive ad scriptwriter and narrative designer for AI-generated video ads.

Your task is to generate a scene-by-scene, video-ready script for an interactive ad, based on the provided story flow and configuration. Each scene will be turned into a separate AI-generated video. The ad is NOT a single linear script, but a branching story with scenes and interactive choice points.

Tone: {config.get("tone", "engaging")}
Brand Voice: {config.get("brandVoice", "friendly")}
Platform: {config.get("platform", "mobile")}
Language: {config.get("language", "english")}
Duration: {config.get("durationInSeconds", 30)} seconds
Theme: {config.get("theme_prompt", "")}
Include Mini Game: {config.get("include_mini_game", False)}
Enable AR Filters: {config.get("enable_ar_filters", False)}
Characters/Elements: {characters_or_elements}

INSTRUCTIONS:
- You MUST use ONLY the provided characters or elements in every scene. Do not invent new characters or elements.
- Make the provided characters/elements central to the narrative, dialogue, visuals, and actions in every scene.
- Return a JSON array, one object per node (scene or scene+choice). DO NOT return prose or markdown.
- For each node of type "scene":
    - Include:
        - scene_id or scene_title (from the flow)
        - visual: a vivid, cinematic description of what the AI video should show
        - dialogue: voiceover or character lines for the scene
        - audio: background music or ambient cue
    - If this scene leads directly into a choice point (i.e., the next node is a choice_point):
        - Add the following fields:
            - post_scene_choice_prompt: a suspenseful hook to prompt user choice (e.g., "What will you do next?")
            - option_a_text: a human-readable label for Option A (decided from story context)
            - option_b_text: a label for Option B
            - option_a_leads_to: the scene_id of the node Option A should take the user to (from the flow)
            - option_b_leads_to: the scene_id of the node Option B should take the user to (from the flow)
        - For option_a_text and option_b_text:
            - Each label should be concise (ideally under 40 characters), clear, and actionable.
- For nodes of type "choice_point":
    - DO NOT generate a standalone script for the choice point. Instead, embed all choice logic in the preceding scene's JSON object as above.
- Each object in the JSON array should therefore be either:
    - A full scene with narration and visuals only, OR
    - A full scene followed by interactive choice metadata (if it leads to a choice point)
- Use the flow structure to:
    - Detect which scenes lead into choices
    - Map branches (A and B) to the correct target scene IDs from the flow
- The output must be clean, valid JSON. Do not include any prose, explanations, or markdown formatting.
- The JSON should be easily machine-readable so each scene can be processed into a video individually.

Begin. Output only the JSON array:
"""

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return response.text.strip() if hasattr(response, "text") else str(response)
    except Exception as e:
        raise RuntimeError(f"Gemini structured script generation failed: {str(e)}")


def call_genkit_script_generation(config: dict, flow: dict) -> str:
    """
    Wrapper for Django views to invoke Gemini structured script generation.
    """
    return generate_structured_ad_script(config, flow)
