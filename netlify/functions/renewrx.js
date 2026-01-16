// RenewRx Live Dashboard API
// Handles patient ingestion and status updates

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

// Global in-memory state (volatile)
let cases = [
  {
    id: "CASE-101",
    patient_name: "Sarah Miller",
    requested_medication: "Latanoprost 0.005%",
    transcript: "I have been having some dry eye symptoms lately but my Latanoprost is almost empty.",
    risk_score: 0.12,
    status: "pending",
    created_at: new Date().toISOString()
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

  // POST: Create (ElevenLabs) OR Update (Retool)
  if (event.httpMethod === 'POST') {
    try {
      const data = JSON.parse(event.body || '{}');
      
      // 1. STATUS UPDATE (Retool)
      // Check if an ID was explicitly passed
      if (data.id) {
        const index = cases.findIndex(c => c.id === data.id);
        if (index > -1) {
          cases[index].status = data.status || 'approved';
          console.log(`[UPDATE] Case ${data.id} set to ${cases[index].status}`);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, message: "Status updated" })
          };
        } else {
          // FIX: If ID provided but not found, DO NOT create a new row.
          // Return an error to stop "random" rows appearing in Retool.
          console.log(`[ERROR] Update failed - Case ${data.id} not found in memory.`);
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ 
              error: "Case not found", 
              message: "The patient record may have expired from serverless memory. Please refresh the page and try again." 
            })
          };
        }
      }

      // 2. NEW INGESTION (ElevenLabs)
      // Only runs if NO 'id' field was provided in the JSON body
      const newCase = {
        id: `CASE-${Date.now()}`,
        patient_name: data.patient_name || "New Intake",
        requested_medication: data.requested_medication || "To be determined",
        transcript: data.transcript || "Conversation in progress...",
        risk_score: data.risk_score || 0.0,
        status: "pending",
        created_at: new Date().toISOString()
      };
      
      cases.push(newCase);
      console.log(`[INGEST] New patient added: ${newCase.patient_name}`);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          case_id: newCase.id,
          message: "Ingested successfully" 
        })
      };
    } catch (e) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON" }) };
    }
  }

  return { statusCode: 405, headers, body: 'Method Not Allowed' };
};
