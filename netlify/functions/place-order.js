const axios = require('axios');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const medicationName = data.medicationName || data.medication_name || "Latanoprost";
    const patientName = data.patientName || data.patient_name || "Eleanor Vance";
    
    // YUTORI CONFIG
    const YUTORI_AGENT_ID = "a5a41c83-c47e-4064-bcbb-70e3cfa5e980";
    const YUTORI_API_KEY = process.env.YUTORI_API_KEY || "yt_J_0s_E3E_3E_3E"; // Should be in Netlify Env

    console.log(`[YUTORI] Triggering Agent ${YUTORI_AGENT_ID} for ${patientName} - ${medicationName}`);

    // EXPLANATION: We are triggering the Yutori Cloud Agent to go to the site and place the order
    const goal = `Go to https://renewrx-mocks-demo-2026.netlify.app/pharmacy/index.html. 
    1. Search for "${medicationName}".
    2. Add it to cart.
    3. Checkout for patient "${patientName}".
    4. Use address "123 Wellness Ave, Healthy City, HC 90210".
    5. Return the Order ID.`;

    try {
      const response = await axios.post(`https://api.yutori.com/v1/navigator/runs`, {
        agent_id: YUTORI_AGENT_ID,
        goal: goal
      }, {
        headers: {
          'Authorization': `Bearer ${YUTORI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          yutori_run_id: response.data.id,
          message: `Sarah has successfully triggered the Yutori agent to fulfill the order for ${medicationName}.`
        })
      };
    } catch (apiError) {
      console.error("Yutori API Error:", apiError.response?.data || apiError.message);
      // Fallback for demo if API key is missing/invalid
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          status: "simulated",
          message: `Sarah has triggered the order flow for ${medicationName}. (Simulated due to API connectivity)`
        })
      };
    }

  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Invalid request payload" })
    };
  }
};
