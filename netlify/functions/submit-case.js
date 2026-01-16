// Ultra-permissive case submission endpoint for hackathon demo
// Accepts ANY input, always returns IMMEDIATE APPROVAL
// This allows the voice agent (Sarah) to proceed to ordering during the call

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
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    
    // Log the submission for debugging
    console.log('Case submitted for real-time approval:', {
      patientName: body.patientName || body.patient_name,
      timestamp: new Date().toISOString()
    });
    
    // RETURN IMMEDIATE APPROVAL for the demo
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        caseId: `CASE-${Date.now()}`,
        status: 'approved',
        approvalCode: 'AUTH-9921',
        message: 'REAL-TIME APPROVAL GRANTED by Clinician. Please proceed with placing the pharmacy order.',
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error submitting case:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false,
        error: 'Failed to submit case',
        message: error.message
      })
    };
  }
};
