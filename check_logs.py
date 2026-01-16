import os
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs

# Load environment variables
load_dotenv('secrets.env')

api_key = os.getenv('ELEVENLABS_API_KEY')
agent_id = "agent_1801kf47czjyej1txfkemcs6ke39"

client = ElevenLabs(api_key=api_key)

try:
    # Fetch conversation history for the agent
    response = client.conversational_ai.conversations.list(agent_id=agent_id)
    
    if not response.conversations:
        print("No conversations found for this agent.")
    else:
        # Get the most recent one
        latest = response.conversations[0]
        print(f"Latest Conversation ID: {latest.conversation_id}")
        print(f"Status: {latest.status}")
        
        # Get the detail including transcript
        detail = client.conversational_ai.conversations.get(conversation_id=latest.conversation_id)
        print("\n--- Transcript ---")
        if detail.transcript:
            for msg in detail.transcript:
                role = "Agent" if msg.role == "agent" else "User"
                print(f"{role}: {msg.message}")
        else:
            print("No transcript available for this conversation.")
            
except Exception as e:
    print(f"Error fetching conversation: {e}")
