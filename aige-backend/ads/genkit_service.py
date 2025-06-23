import os
import json
import genkit
from genkit import gemini

# 🌟 Initialize Genkit with Gemini
try:
    genkit.config(
        plugins=[
            gemini.GeminiPlugin(api_key=os.getenv("GOOGLE_API_KEY"))
        ]
    )
except Exception as e:
    print(f"❌ Failed to configure Genkit: {e}")
    raise

@genkit.flow(name="generate_ad_script", description="Generate an interactive ad script using Genkit")
def generate_ad_script(config: dict, flow: dict) -> str:
    """
    Generate an interactive ad script using Genkit and Gemini.

    Args:
        config: Ad configuration containing tone, theme, etc.
        flow: Story flow structure with scenes and branches

    Returns:
        Generated ad script
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
        response = gemini.generate(
            model="gemini-1.5-flash",
            prompt=prompt,
            config={
                "temperature": 0.7,
                "maxOutputTokens": 2048
            }
        )
        return getattr(response, "text", str(response))
    except Exception as e:
        raise Exception(f"Genkit script generation failed: {str(e)}")

def call_genkit_script_generation(config: dict, flow: dict) -> str:
    """
    Wrapper for Django view to invoke Genkit script flow.
    """
    return generate_ad_script(config, flow)
