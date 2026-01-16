// Yutori Pharmacy Automation - Mock Order Placement
// Simulates navigating the pharmacy portal to fulfill an approved prescription

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
    const { medicationName, patientName, quantity } = data;

    console.log(`[YUTORI] Starting fulfillment for: ${patientName}`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        order_id: `ORD-${Math.floor(Math.random() * 900000) + 100000}`,
        status: "confirmed",
        estimated_arrival: "Within 3-5 business days",
        message: `Order for ${quantity}x ${medicationName} has been successfully transmitted to the pharmacy.`
      })
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Invalid order payload" })
    };
  }
};
