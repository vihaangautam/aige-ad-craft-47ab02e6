import json
import os
from .genkit_service import call_genkit_script_generation

def build_ai_prompt(config, flow):
    """
    Legacy function - now just passes data to Genkit service
    """
    # This function is now mainly for backward compatibility
    # The actual prompt building is done in genkit_service.py
    return {"config": config, "flow": flow}

def call_gemini_or_gpt(prompt_data):
    """
    Updated function that now uses Genkit instead of OpenAI
    """
    if isinstance(prompt_data, dict):
        config = prompt_data.get("config", {})
        flow = prompt_data.get("flow", {})
    else:
        # Fallback for legacy string prompts
        config = {"theme_prompt": str(prompt_data)}
        flow = {}
    
    return call_genkit_script_generation(config, flow)