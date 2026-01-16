// RenewRx Simplest API
// Handles GET (list) and POST (ingest or update)

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

// Global in-memory state (reset on function recycle)
let cases = [
  {
    id: "CASE-101",
    patient_name: "Sarah Miller",
    requested_medication: "Latanoprost 0.005%",
    transcript: "I have been having some dry eye symptoms lately but my Latanoprost is almost empty.",
    risk_score: 0.12,
    status: "pending",
    created_at: "2026-01-16T12:00:00Z"
  }
];

exports.handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // GET: List all cases
  if (event.httpMethod === 'GET') {
    return { statusCode: 200, headers, body: JSON.stringify(cases) };
  }

  // POST: Create or Update
  if (event.httpMethod === 'POST') {
    try {
      const data = JSON.parse(event.body || '{}');
      
      // If ID exists, it's a status update from Retool
      if (data.id) {
        const index = cases.findIndex(c => c.id === data.id);
        if (index > -1) {
          cases[index].status = data.status || 'approved';
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, message: "Status updated" })
          };
        }
      }

      // Otherwise, it's a new ingestion from ElevenLabs
      const newCase = {
        id: `CASE-${Date.now()}`,
        patient_name: data.patient_name || "Unknown",
        requested_medication: data.requested_medication || "Not specified",
        transcript: data.transcript || "No transcript provided",
        risk_score: data.risk_score || 0.0,
        status: "pending",
        created_at: new Date().toISOString()
      };
      
      cases.push(newCase);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, case_id: newCase.id })
      };
    } catch (e) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON" }) };
    }
  }

  return { statusCode: 405, headers, body: 'Method Not Allowed' };
};
