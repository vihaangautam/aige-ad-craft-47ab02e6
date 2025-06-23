import json
import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")  # More secure

def build_ai_prompt(config, flow):
    prompt = f"""You are an expert ad scriptwriter.

Write a 30-second interactive video ad script using the details below.

Tone: {config.get("tone")}
Brand Voice: {config.get("brandVoice")}
Platform: {config.get("platform")}
Language: {config.get("language")}
Duration: {config.get("durationInSeconds", 30)} seconds

Story Flow:
{json.dumps(flow, indent=2)}

Instructions:
- Break the ad into scenes.
- For each scene, write a title, visual suggestion, dialogue/narration, and background audio cue.
- Include user choices and outcome branches if present.
- End with a brand CTA.

Now begin the script."""
    return prompt

def call_gemini_or_gpt(prompt):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )
    return response.choices[0].message.content.strip()
