import unittest
from unittest.mock import patch
from .flow_preprocess import preprocess_flow_for_script
from .genkit_service import generate_structured_ad_script, genai

# Create your tests here.

class FlowPreprocessTests(unittest.TestCase):
    def test_preprocess_adds_node_type_and_merges_choice(self):
        flow = {
            'nodes': [
                {'id': '1', 'type': 'scene', 'data': {'nodeType': 'Scene', 'title': 'Opening'}},
                {'id': '2', 'type': 'choice_point', 'data': {'nodeType': 'choice_point', 'description': 'Choose!', 'options': [
                    {'label': 'A', 'nextSceneId': '3'}, {'label': 'B', 'nextSceneId': '4'}]}},
                {'id': '3', 'type': 'scene', 'data': {'nodeType': 'Scene', 'title': 'Scene A'}},
                {'id': '4', 'type': 'scene', 'data': {'nodeType': 'Scene', 'title': 'Scene B'}},
                {'id': '5', 'type': 'game', 'data': {'nodeType': 'game', 'title': 'Mini Game'}},
                {'id': '6', 'type': 'scene', 'data': {'nodeType': 'Scene', 'title': 'Final Scene'}},
            ],
            'edges': [
                {'source': '1', 'target': '2'},
                {'source': '2', 'target': '3'},
                {'source': '2', 'target': '4'},
                {'source': '3', 'target': '5'},
                {'source': '4', 'target': '5'},
                {'source': '5', 'target': '6'},
            ]
        }
        processed = preprocess_flow_for_script(flow)
        self.assertTrue(all('node_type' in node for node in processed))
        self.assertEqual(processed[0]['post_scene_choice_prompt'], 'Choose!')

class ScriptGenerationTests(unittest.TestCase):
    def test_generate_structured_ad_script_includes_game_node(self):
        config = {
            'characters_or_elements': 'Hero, Villain',
            'tone': 'fun',
            'brandVoice': 'exciting',
            'platform': 'mobile',
            'language': 'english',
            'durationInSeconds': 30,
            'theme_prompt': 'Adventure',
        }
        flow = {
            'nodes': [
                {'id': '1', 'type': 'scene', 'data': {'nodeType': 'Scene', 'title': 'Opening'}},
                {'id': '2', 'type': 'choice_point', 'data': {'nodeType': 'choice_point', 'description': 'Choose!', 'options': [
                    {'label': 'A', 'nextSceneId': '3'}, {'label': 'B', 'nextSceneId': '4'}]}},
                {'id': '3', 'type': 'scene', 'data': {'nodeType': 'Scene', 'title': 'Scene A'}},
                {'id': '4', 'type': 'scene', 'data': {'nodeType': 'Scene', 'title': 'Scene B'}},
                {'id': '5', 'type': 'game', 'data': {'nodeType': 'game', 'title': 'Mini Game'}},
                {'id': '6', 'type': 'scene', 'data': {'nodeType': 'Scene', 'title': 'Final Scene'}},
            ],
            'edges': [
                {'source': '1', 'target': '2'},
                {'source': '2', 'target': '3'},
                {'source': '2', 'target': '4'},
                {'source': '3', 'target': '5'},
                {'source': '4', 'target': '5'},
                {'source': '5', 'target': '6'},
            ]
        }
        # Patch the GenerativeModel class directly
        with patch.object(genai, 'GenerativeModel') as mock_model:
            mock_instance = mock_model.return_value
            mock_instance.generate_content.return_value.text = '[{"scene_id": "5", "visual": "Mini Game"}]'
            script = generate_structured_ad_script(config, flow)
            self.assertIn('Mini Game', script)

if __name__ == '__main__':
    unittest.main()
