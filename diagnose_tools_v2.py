import os
import json
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs

# Load environment variables
load_dotenv('secrets.env')

api_key = os.getenv('ELEVENLABS_API_KEY')
conversation_id = "conv_1801kf4je19cff2axv7f27ykyx7r"

client = ElevenLabs(api_key=api_key)

try:
    detail = client.conversational_ai.conversations.get(conversation_id=conversation_id)
    
    print(f"Conversation ID: {conversation_id}")
    
    # 1. Check detail.analysis
    if detail.analysis:
        print("\n--- Analysis -> Tool Calls ---")
        # ElevenLabs Analysis model has evaluation_criteria, data_collection_results, etc.
        # Let's check for tool_calls specifically
        analysis_dict = detail.analysis.model_dump()
        if 'tool_calls' in analysis_dict and analysis_dict['tool_calls']:
            for call in analysis_dict['tool_calls']:
                print(json.dumps(call, indent=2))
                print("-" * 20)
        else:
            print("No tool_calls found in analysis dict.")
            # print(f"Analysis keys: {analysis_dict.keys()}")

    # 2. Check Transcript Messages for tool calls
    print("\n--- Transcript Tool Calls ---")
    for i, msg in enumerate(detail.transcript):
        msg_dict = msg.model_dump()
        if msg_dict.get('role') == 'tool_call' or msg_dict.get('tool_call_result'):
            print(f"Index {i} ({msg_dict.get('role')}):")
            print(json.dumps(msg_dict, indent=2))
            print("-" * 20)
        elif msg_dict.get('tool_calls'):
            print(f"Index {i} (Agent with tool calls):")
            print(json.dumps(msg_dict.get('tool_calls'), indent=2))
            print("-" * 20)

except Exception as e:
    print(f"Error fetching conversation details: {e}")
    import traceback
    traceback.print_exc()
