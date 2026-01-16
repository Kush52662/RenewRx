# Yutori Cloud Agent Configuration

The Yutori Cloud Agent has been configured to handle pharmacy ordering via a Netlify Function proxy. This allows ElevenLabs to call a clean API that then orchestrates the complex browser interaction.

## Cloud Infrastructure

1.  **Target Website**: `https://renewrx-mocks-demo-2026.netlify.app/pharmacy/index.html`
2.  **Proxy Function**: `https://renewrx-mocks-demo-2026.netlify.app/api/place-order`
1.  **Yutori API**: `https://api.yutori.com/v1/navigator/runs`
4.  **Agent ID**: `a5a41c83-c47e-4064-bcbb-70e3cfa5e980` (Pharmacy Ordering Agent)

## Setup Instructions

1.  **Environment Variables**:
    - Add `YUTORI_API_KEY` (`yt_J_0s_...`) to your Netlify environment variables for the site `renewrx-mocks-demo-2026`.
    
2.  **ElevenLabs Integration**:
    - The `place_pharmacy_order` tool is defined in `elevenlabs/tools_spec.json`.
    - Point the tool's webhook URL to your deployed Netlify function: `https://<YOUR_NETLIFY_URL>/api/place-order`.

## Agent Instructions (Configured in Proxy)

The agent follows these steps:
- Navigates to the pharmacy portal.
- Searches for the specified medication.
- Adds it to the cart.
- Fills out the checkout form with the patient's name and a default address.
- Places the order.
- Extracts and returns the Order ID (e.g., `ORD-12345`).
