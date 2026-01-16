// RenewRx Clinician Queue API
// Handles ingestion from ElevenLabs and Approval from Retool

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

// In-memory cases (will reset on function recycle, fine for hackathon demo)
let cases = [
  {
    id: "CASE-101",
    patient_name: "Sarah Miller",
    transcript: "I have been having some dry eye symptoms lately but my Latanoprost is almost empty. I would like a refill please.",
    risk_score: 0.12,
    status: "pending",
    created_at: new Date().toISOString()
  }
];

exports.handler = async (event, context) => {
  const path = event.path;
  const method = event.httpMethod;

  // Handle preflight
  if (method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // GET /cases - List all cases
  if (method === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(cases)
    };
  }

  // POST /ingest - From ElevenLabs
  if (method === 'POST' && path.includes('/ingest')) {
    try {
      const data = JSON.parse(event.body || '{}');
      console.log('Ingesting new case:', data.patient_name);
      
      // In a real app, we would write to a DB. For demo, we just return success.
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          case_id: `CASE-${Date.now()}`,
          message: "Case ingested successfully"
        })
      };
    } catch (error) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON" }) };
    }
  }

  // POST /approve - From Retool
  if (method === 'POST' && path.includes('/approve')) {
    try {
      const data = JSON.parse(event.body || '{}');
      console.log('Case approved:', data.case_id);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          status: data.status,
          message: `Case ${data.status} successfully`
        })
      };
    } catch (error) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON" }) };
    }
  }

  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ error: "Endpoint not found", path })
  };
};
