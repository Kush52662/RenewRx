from yutori import YutoriClient
import sys

API_KEY = "sk-mino-sEaZDbyVN5_yEYUJq8mbYLrWJeifJLRU"

def test_sdk():
    client = YutoriClient(api_key=API_KEY)
    try:
        print("Testing list_scouts()...")
        scouts = client.list_scouts()
        print(f"Scouts: {scouts}")
    except Exception as e:
        print(f"Error listing scouts: {e}")

    try:
        print("\nTesting get_usage()...")
        usage = client.get_usage()
        print(f"Usage: {usage}")
    except Exception as e:
        print(f"Error getting usage: {e}")

    client.close()

if __name__ == "__main__":
    test_sdk()
