import os
import json
from genkit import genkit
from genkit.models import gemini

# Initialize Genkit with Gemini
genkit.config(
    plugins=[
        gemini.GeminiPlugin(api_key=os.getenv("GOOGLE_API_KEY"))
    ]
)

@genkit.flow
def generate_ad_script(config: dict, flow: dict) -> str:
    """
    Generate an interactive ad script using Genkit and Gemini.
    
    Args:
        config: Ad configuration containing theme, tone, etc.
        flow: Story flow structure with scenes and choices
    
    Returns:
        Generated script as a string
    """
    
    # Build the AI prompt
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

    # Generate using Gemini
    response = gemini.generate(
        model="gemini-1.5-flash",
        prompt=prompt,
        config={
            "temperature": 0.7,
            "maxOutputTokens": 2048,
        }
    )
    
    return response.text

def call_genkit_script_generation(config: dict, flow: dict) -> str:
    """
    Wrapper function to call the Genkit flow from Django views.
    """
    try:
        result = generate_ad_script(config, flow)
        return result
    except Exception as e:
        raise Exception(f"Genkit script generation failed: {str(e)}")