import os
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs

# Load environment variables
load_dotenv('secrets.env')

api_key = os.getenv('ELEVENLABS_API_KEY')
conversation_id = "conv_1801kf4je19cff2axv7f27ykyx7r" # Latest from check_logs.py

client = ElevenLabs(api_key=api_key)

try:
    detail = client.conversational_ai.conversations.get(conversation_id=conversation_id)
    
    print(f"Conversation ID: {conversation_id}")
    print(f"Status: {detail.status}")
    
    print("\n--- Tool Calls ---")
    # Looking for tool call details in the response
    # Based on ElevenLabs API docs, conversation details should have a list of tool calls
    if hasattr(detail, 'analysis') and hasattr(detail.analysis, 'tool_calls'):
        for call in detail.analysis.tool_calls:
            print(f"Tool: {call.tool_name}")
            print(f"Status: {call.status}")
            if hasattr(call, 'error'):
                print(f"Error: {call.error}")
            if hasattr(call, 'request'):
                print(f"Request: {call.request}")
            if hasattr(call, 'response'):
                print(f"Response: {call.response}")
            print("-" * 20)
    else:
        # If it's not structured like that, let's dump the whole object or relevant parts
        print("Analysis or Tool Calls attribute not found directly. Checking raw response structure...")
        # Print available attributes
        print(f"Available attributes: {dir(detail)}")
        
        # In newer SDKs, it might be in the events or transcript messages
        for msg in detail.transcript:
            if hasattr(msg, 'tool_calls') and msg.tool_calls:
                for call in msg.tool_calls:
                    print(f"Tool Call found in transcript message:")
                    # print(call) # Pydantic model usually
                    
except Exception as e:
    print(f"Error fetching conversation details: {e}")
