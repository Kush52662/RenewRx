const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

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
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  if (event.httpMethod === 'GET') return { statusCode: 200, headers, body: JSON.stringify(cases) };

  if (event.httpMethod === 'POST') {
    try {
      const data = JSON.parse(event.body || '{}');
      
      // IF ID IS PRESENT -> STRICT UPDATE MODE (Called by Retool/Clinician)
      if (data.id) {
        const index = cases.findIndex(c => c.id === data.id);
        if (index > -1) {
          cases[index].status = data.status || 'approved';
          return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: "Status updated" }) };
        }
        return { statusCode: 404, headers, body: JSON.stringify({ error: "Patient record not found." }) };
      }

      // NO ID -> INGESTION MODE (Called by Sarah Agent)
      const newCase = {
        id: "CASE-" + Date.now(),
        patient_name: data.patientName || data.patient_name || "New Intake",
        requested_medication: data.requestedMedication || data.requested_medication || "Not specified",
        transcript: data.transcript || "N/A",
        risk_score: data.riskScore || data.risk_score || 0.0,
        status: "approved", // FOR THE DEMO: Auto-approve so Sarah can proceed
        created_at: new Date().toISOString()
      };
      
      cases.push(newCase);
      
      // Return the approved status so Sarah sees "status: approved" and moves to ordering
      return { 
        statusCode: 200, 
        headers, 
        body: JSON.stringify({ 
          success: true, 
          case_id: newCase.id, 
          status: "approved", 
          message: "Case submitted and auto-approved for refill." 
        }) 
      };
    } catch (e) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON" }) };
    }
  }
  return { statusCode: 405, headers, body: 'Method Not Allowed' };
};
