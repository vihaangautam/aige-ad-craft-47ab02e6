import os
import json
import google.generativeai as genai

# Configure API key
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def generate_ad_script(config: dict, flow: dict) -> str:
    """
    Generate an interactive ad script using Gemini (Google GenAI).
    """
    prompt = f"""You are an expert ad scriptwriter.

Write a 30-second interactive video ad script using the details below.

Tone: {config.get("tone", "engaging")}
Brand Voice: {config.get("brandVoice", "friendly")}
Platform: {config.get("platform", "mobile")}
Language: {config.get("language", "english")}
Duration: {config.get("durationInSeconds", 30)} seconds
Theme: {config.get("theme_prompt", "")}

Story Flow:
{json.dumps(flow, indent=2)}

Instructions:
- Break the ad into scenes that match the provided flow structure
- For each scene, write a title, visual suggestion, dialogue/narration, and background audio cue
- Include user choices and outcome branches as specified in the flow
- Make it engaging and interactive
- End with a compelling brand CTA
- Format as a structured script with clear scene divisions

Now begin the script:"""

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return response.text.strip() if hasattr(response, "text") else str(response)
    except Exception as e:
        raise RuntimeError(f"Gemini script generation failed: {str(e)}")

def call_genkit_script_generation(config: dict, flow: dict) -> str:
    """
    Wrapper for Django views to invoke Gemini script generation.
    """
    return generate_ad_script(config, flow)
