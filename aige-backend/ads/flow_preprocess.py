def preprocess_flow_for_script(flow):
    """
    Preprocesses the flow so that:
    - Only scene nodes are output.
    - If a scene leads to a choice_point, embeds the choice_point's data into the scene node.
    - Choice_point nodes are not output as standalone entries.
    Returns a list of scene nodes ready for script generation.
    """
    # Support both dict (with 'nodes' and 'edges') and flat list
    if isinstance(flow, dict) and 'nodes' in flow and 'edges' in flow:
        nodes = flow['nodes']
        edges = flow['edges']
    elif isinstance(flow, list):
        # Assume flat list of nodes, no edges (not supported for merging)
        return [dict(node, node_type=node.get('type') or node.get('data', {}).get('nodeType')) for node in flow if node.get('type') == 'scene']
    else:
        return []

    # Build node lookup by id
    node_by_id = {str(node.get('id')): node for node in nodes}
    # Build outgoing edges map: source_id -> [target_id,...]
    outgoing = {}
    for edge in edges:
        src = str(edge.get('source'))
        tgt = str(edge.get('target'))
        outgoing.setdefault(src, []).append(tgt)

    result = []
    for node in nodes:
        node_type = node.get('type') or node.get('data', {}).get('nodeType')
        node_id = str(node.get('id'))
        if node_type in ('scene', 'Scene', 'storyNode'):
            scene_obj = dict(node)  # shallow copy
            scene_obj['node_type'] = node_type  # Add node_type field
            # Check if this scene leads to a choice_point
            next_ids = outgoing.get(node_id, [])
            if next_ids:
                next_id = next_ids[0]  # Only one outgoing for scenes
                next_node = node_by_id.get(next_id)
                if next_node:
                    next_type = next_node.get('type') or next_node.get('data', {}).get('nodeType')
                    if next_type in ('choice', 'choice_point', 'Option Point'):
                        # Merge choice_point data into this scene
                        choice_data = next_node.get('data', {})
                        # Embed required fields
                        scene_obj['post_scene_choice_prompt'] = choice_data.get('description')
                        options = choice_data.get('options', [])
                        if len(options) >= 2:
                            scene_obj['option_a_text'] = options[0].get('label')
                            scene_obj['option_b_text'] = options[1].get('label')
                            scene_obj['option_a_leads_to'] = options[0].get('nextSceneId')
                            scene_obj['option_b_leads_to'] = options[1].get('nextSceneId')
            result.append(scene_obj)
    return result 