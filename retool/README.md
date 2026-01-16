# RenewRx Retool Integration

## Overview
This directory contains configuration and documentation for the **Retool Agent** that serves as the clinician approval interface in the RenewRx system.

## Architecture

### Serverless, Cloud-Native Design
```
┌─────────────────────┐
│  ElevenLabs Agent   │  (Patient Intake)
│  (Voice Interface)  │
└──────────┬──────────┘
           │
           │ submit_case_to_clinician (A2A)
           │ {patient_name, transcript, risk_score}
           │
           ▼
┌─────────────────────┐
│   Retool Agent      │  (Clinician Approval)
│  "Prescription      │  • Reviews case
│   renewal"          │  • Doctor responds: APPROVE/DECLINE
│                     │  • Doctor adds custom message
└──────────┬──────────┘
           │
           │ APPROVED/DECLINED + Custom Doctor Message
           │
           ▼
┌─────────────────────┐
│  ElevenLabs Agent   │  (Patient Notification)
│  (Continues Call)   │  • Informs patient of decision
│                     │  • Relays doctor's message
└─────────────────────┘
```

## Components

### 1. Retool Agent (Human-in-the-Loop)
- **Type**: Conversational AI Agent (GPT-4.1)
- **Purpose**: Present patient cases to clinicians for approval
- **Endpoint**: `https://sapientury.retool.com/api/agents/a2a/16c47569-e486-457b-b34e-ad304ba705ce`
- **API Key**: `retool_wk_9c038cd26c1b4a4cb4b3ab5d107bf9ff`

### 2. Agent-to-Agent (A2A) Protocol
- Enables direct communication between ElevenLabs and Retool agents
- Supports bidirectional messaging
- No intermediary server required

### 3. No Database Layer (Simplified)
- Original plan included a `cases` table in Retool DB
- Current implementation: **Stateless approval flow**
- All data passes through in real-time without persistence
- Simplifies architecture and reduces complexity

## Configuration Files

### `agent_instructions.md`
Complete setup guide for configuring the Retool Agent with:
- Instructions for the AI
- Integration details for ElevenLabs
- Testing procedures
- Architecture flow diagram

### `../secrets.env`
Contains the following keys:
```env
RETOOL_AGENT_ENDPOINT=https://sapientury.retool.com/api/agents/a2a/16c47569-e486-457b-b34e-ad304ba705ce/.well-known/agent-card.json
RETOOL_AGENT_API_KEY=retool_wk_9c038cd26c1b4a4cb4b3ab5d107bf9ff
```

## Integration Points

### ElevenLabs Tool Configuration
The `submit_case_to_clinician` tool in `../elevenlabs/tools_spec.json` is configured to call the Retool Agent directly:

```json
{
  "name": "submit_case_to_clinician",
  "url": "https://sapientury.retool.com/api/agents/a2a/16c47569-e486-457b-b34e-ad304ba705ce",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer retool_wk_9c038cd26c1b4a4cb4b3ab5d107bf9ff",
    "Content-Type": "application/json"
  }
}
```

## Why This Approach?

### Previous Attempts
1. ✗ **FastAPI Server**: Killed (unnecessary local server)
2. ✗ **Retool Workflow**: Malformed JSON errors
3. ✓ **Retool Agent**: Simple, conversational, cloud-native

### Benefits
- **Zero Infrastructure**: No servers to maintain
- **Conversational**: Natural language approval process
- **Real-time**: Immediate doctor-patient feedback loop
- **Scalable**: Retool handles all hosting and scaling
- **Secure**: API key authentication on all endpoints

## Testing

### In Retool Console
1. Go to your agent: "Prescription renewal"
2. Click the "Chats" tab
3. Send a test message with patient data
4. Respond with "APPROVED" or "DECLINED"
5. Add a custom doctor's message (e.g., "Continue current dosage" or "Schedule follow-up in 3 months")

### From ElevenLabs
1. Make a test call to your ElevenLabs agent
2. Complete the intake process
3. The agent will automatically call `submit_case_to_clinician`
4. You'll receive the case in your Retool Agent chat

## Deployment Status
- ✅ Agent created and configured
- ✅ A2A protocol enabled
- ✅ ElevenLabs integration configured
- ✅ API keys stored securely
- ✅ Documentation complete

## Next Steps
1. Test the end-to-end flow with a real ElevenLabs call
2. Monitor agent performance in Retool "Monitor" tab
3. (Optional) Add observability via Macroscope/Sentry
4. (Optional) Add case persistence if audit trail is needed

## Support
- Retool Docs: https://docs.retool.com/agents
- ElevenLabs Docs: https://docs.elevenlabs.io/
