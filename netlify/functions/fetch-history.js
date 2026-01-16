// Ultra-permissive fetch history endpoint for hackathon demo
// Accepts ANY input, always returns Eleanor Vance data

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
    // Hardcoded Eleanor Vance data for hackathon demo
    const tonicData = {
      "patient": {
        "id": "PT-883920",
        "name": "Eleanor Vance",
        "dob": "1954-08-12",
        "address": "42 Hill House Ln, Brookline, MA 02445",
        "phone": "(617) 555-0199",
        "email": "eleanor.v@example.com"
      },
      "allergies": [
        {
          "allergen": "Penicillin",
          "reaction": "Hives",
          "severity": "Moderate"
        },
        {
          "allergen": "Sulfa Drugs",
          "reaction": "Rash",
          "severity": "Mild"
        }
      ],
      "medications": [
        {
          "name": "Latanoprost",
          "dosage": "0.005% Ophthalmic Solution",
          "frequency": "1 drop in both eyes at bedtime",
          "prescriber": "Dr. Sarah Smith (Ophthalmology)",
          "last_filled": "2025-12-15",
          "refills_remaining": 1,
          "status": "Active"
        },
        {
          "name": "Lisinopril",
          "dosage": "10mg Tablet",
          "frequency": "1 tablet daily",
          "prescriber": "Dr. Michael Jones (Primary Care)",
          "last_filled": "2025-12-01",
          "refills_remaining": 3,
          "status": "Active"
        },
        {
          "name": "Atorvastatin",
          "dosage": "20mg Tablet",
          "frequency": "1 tablet at bedtime",
          "prescriber": "Dr. Michael Jones (Primary Care)",
          "last_filled": "2025-11-20",
          "refills_remaining": 0,
          "status": "Refill Needed"
        },
        {
          "name": "Metformin",
          "dosage": "500mg Tablet",
          "frequency": "1 tablet twice daily with meals",
          "prescriber": "Dr. Michael Jones (Primary Care)",
          "last_filled": "2025-12-10",
          "refills_remaining": 2,
          "status": "Active"
        }
      ],
      "appointments": [
        {
          "date": "2026-02-15",
          "time": "10:00 AM",
          "provider": "Dr. Sarah Smith",
          "department": "Ophthalmology",
          "type": "Follow-up"
        }
      ]
    };

    // Return the patient data (ultra-permissive - accept any input)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        patient: tonicData.patient,
        allergies: tonicData.allergies,
        medications: tonicData.medications,
        appointments: tonicData.appointments
      })
    };
  } catch (error) {
    console.error('Error fetching medical history:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false,
        error: 'Failed to fetch medical history',
        message: error.message
      })
    };
  }
};
