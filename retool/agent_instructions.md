# RenewRx Prescription Renewal Agent - Configuration

## Agent Details
- **Name**: Prescription renewal
- **Endpoint**: `https://sapientury.retool.com/api/agents/a2a/16c47569-e486-457b-b34e-ad304ba705ce/.well-known/agent-card.json`
- **API Key**: `retool_wk_9c038cd26c1b4a4cb4b3ab5d107bf9ff`

## Purpose
This agent serves as a **Human-in-the-Loop (HITL)** interface between the ElevenLabs intake agent and clinicians. It receives patient information collected during the intake conversation and presents it to a doctor for approval or decline.

## Configuration Instructions

### Instructions Field
Replace the current instructions in your Retool Agent with:

```
You are a clinician approval assistant for RenewRx prescription renewals.

When you receive patient information from the ElevenLabs intake agent, you should:

1. **Display the Patient Information Clearly**:
   - Patient name
   - Transcript of the intake conversation
   - Risk score (if provided)
   - Medication history
   - Any symptoms or concerns mentioned

2. **Present for Approval**:
   - Ask the clinician: "Would you like to APPROVE or DECLINE this prescription renewal?"
   - Also ask: "Please add any notes or instructions for the patient (optional)"
   - Wait for their decision and any custom message

3. **Respond to ElevenLabs**:
   - If APPROVED: Respond with "APPROVED - Prescription renewal authorized. Doctor's message: [include their custom message if provided]"
   - If DECLINED: Respond with "DECLINED - Prescription renewal not authorized. Doctor's message: [include their reason/message]"
   - Always include the doctor's custom message in your response
   - If no custom message provided, use a default like "Standard renewal" or "See notes"

Keep your responses concise and professional. You are facilitating the approval process, not making medical decisions. Always capture and relay the doctor's message back to the system.
```

### Tools Configuration
**IMPORTANT**: Do NOT add any tools. This agent should remain a simple conversational interface without database access or external API calls.

    ### Model
    - **Recommended**: Gemini 2.5 Flash (for native audio and proactive context awareness)
    - **Alternate**: GPT-4o (if Gemini is unavailable)

### Triggers
- **A2A (Agent-to-Agent)**: Already enabled ✅
- **Chat**: Optional (for testing in the UI)

## Integration with ElevenLabs

The ElevenLabs agent should call this endpoint after completing the patient intake. Configure the `submit_case_to_clinician` tool in ElevenLabs to use:

- **URL**: `https://sapientury.retool.com/api/agents/a2a/16c47569-e486-457b-b34e-ad304ba705ce`
- **Method**: POST
- **Headers**:
  - `Authorization: Bearer retool_wk_9c038cd26c1b4a4cb4b3ab5d107bf9ff`
  - `Content-Type: application/json`
- **Body**:
```json
{
  "patient_name": "{{patient_name}}",
  "transcript": "{{transcript}}",
  "risk_score": {{risk_score}},
  "evidence": {{evidence}},
  "synthetic_history": {{synthetic_history}}
}
```

## Testing

You can test this agent directly in the Retool "Chats" tab by sending a message like:

```
New patient case for approval:
- Patient: John Doe
- Transcript: "I need a refill for my Latanoprost. No changes in vision."
- Risk Score: 0.1

Please review and approve or decline.
```

**Example Doctor Response:**
```
APPROVE
Continue current dosage. Schedule follow-up in 6 months if no changes.
```

**Agent will respond to ElevenLabs with:**
```
APPROVED - Prescription renewal authorized. Doctor's message: Continue current dosage. Schedule follow-up in 6 months if no changes.
```

## Architecture Flow

```
ElevenLabs Agent (Patient Intake)
    ↓
    Collects: name, symptoms, history
    ↓
    Calls: submit_case_to_clinician tool
    ↓
Retool Agent (This Agent)
    ↓
    Presents to Clinician
    ↓
    Clinician Decision: APPROVE / DECLINE
    ↓
    Response sent back to ElevenLabs
    ↓
ElevenLabs Agent (Continues conversation)
    ↓
    Informs patient of outcome
```

## Notes
- This is a **serverless, cloud-native** solution - no FastAPI or local server required
- The agent acts as a "smart webhook" that can interact conversationally
- A2A protocol allows direct agent-to-agent communication
- All data flows through Retool's infrastructure
