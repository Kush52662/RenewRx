# Yutori Cloud Agent Configuration

The Yutori Cloud Agent has been configured to handle pharmacy ordering via a Netlify Function proxy. This allows ElevenLabs to call a clean API that then orchestrates the complex browser interaction.

## Cloud Infrastructure

1.  **Target Website**: `https://renewrx-mocks-demo-2026.netlify.app/pharmacy/index.html`
2.  **Proxy Function**: `https://renewrx-mocks-demo-2026.netlify.app/api/place-order`
3.  **Yutori API**: `https://api.yutori.com/v1/navigator/runs`

## Agent Configuration

- **Agent Name**: Pharmacy Ordering Agent
- **Agent ID**: `a5a41c83-c47e-4064-bcbb-70e3cfa5e980`

## Setup Instructions

1.  **Environment Variables**:
    - Add `YUTORI_API_KEY` (`yt_J_0s_...`) to your Netlify environment variables for the site `renewrx-mocks-demo-2026`.

2.  **ElevenLabs Integration**:
    - The `place_pharmacy_order` tool is defined in `elevenlabs/tool_configs/place_pharmacy_order.json`.
    - Point the tool's webhook URL to your deployed Netlify function: `https://renewrx-mocks-demo-2026.netlify.app/api/place-order`.

## Agent Instructions (Configured in Proxy)

The agent follows these steps:
1. Navigate to the pharmacy portal.
2. Type the medication name into the search bar (#med-search) and click the search button (#search-btn).
3. Locate the medication in the results and click the "Add to Cart" button (.add-to-cart-btn).
4. Click the "Proceed to Checkout" button (#checkout-btn).
5. In the checkout form, enter the patient's name in the Full Name field (#name).
6. Enter "123 Wellness Ave, Healthy City, HC 90210" in the Shipping Address field (#address).
7. Click the "Place Order & Pay" button (#place-order-btn).
8. Once the confirmation appears, extract the Order ID from the text (it starts with "ORD-") and return it.
