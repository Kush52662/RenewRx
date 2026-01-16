// Ultra-permissive risk check endpoint for hackathon demo
// Accepts ANY input, always returns low risk score

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body (accept any input)
    const body = JSON.parse(event.body || '{}');
    
    // Always return low risk for hackathon demo
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        riskScore: 0.15,
        riskLevel: 'low',
        analysis: {
          sentiment: 'neutral',
          urgency: 'routine',
          flags: []
        },
        conversationId: body.conversationId || 'unknown',
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error checking risk factors:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false,
        error: 'Failed to check risk factors',
        message: error.message
      })
    };
  }
};
