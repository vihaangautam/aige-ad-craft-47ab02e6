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

def update_choice_point_labels_from_script(script_json_str, flow):
    """
    Updates the label_a and label_b fields of choice point nodes in the flow
    using option_a_text and option_b_text from the generated script.
    Assumes flow is a dict or list of nodes, each with an id and type.
    """
    try:
        script_json = json.loads(script_json_str)
    except Exception:
        return flow  # If script is not valid JSON, return flow unchanged

    # Build a mapping from scene_id to option labels from the script
    scene_options = {}
    for node in script_json:
        scene_id = node.get("scene_id") or node.get("scene_title")
        if scene_id and "option_a_text" in node and "option_b_text" in node:
            scene_options[scene_id] = {
                "option_a_text": node["option_a_text"],
                "option_b_text": node["option_b_text"]
            }

    # Helper to update a single node
    def update_node(node):
        if node.get("type") == "choice_point":
            # Find the preceding scene node that leads to this choice point
            for scene_id, options in scene_options.items():
                # If this choice point's id matches a leads_to in the script
                if node.get("id") in [
                    node.get("option_a_leads_to"),
                    node.get("option_b_leads_to")
                ]:
                    node["label_a"] = options["option_a_text"]
                    node["label_b"] = options["option_b_text"]
        return node

    # If flow is a list of nodes
    if isinstance(flow, list):
        return [update_node(node) for node in flow]
    # If flow is a dict with nodes
    elif isinstance(flow, dict) and "nodes" in flow:
        flow["nodes"] = [update_node(node) for node in flow["nodes"]]
        return flow
    else:
        return flow