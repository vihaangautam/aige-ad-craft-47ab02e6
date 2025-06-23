import json
import os
from .genkit_service import call_genkit_script_generation

def build_ai_prompt(config, flow):
    """
    Passes data to Gemini (Google GenAI) service
    """
    return {"config": config, "flow": flow}

def call_gemini_or_gpt(prompt_data):
    """
    Uses Gemini (Google GenAI) for script generation
    """
    if isinstance(prompt_data, dict):
        config = prompt_data.get("config", {})
        flow = prompt_data.get("flow", {})
    else:
        # Fallback for legacy string prompts
        config = {"theme_prompt": str(prompt_data)}
        flow = {}
    
    return call_genkit_script_generation(config, flow)