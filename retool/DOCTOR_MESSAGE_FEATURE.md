# Doctor Custom Message Feature

## Overview
Enhanced the Retool Agent to allow doctors to include custom messages with their approval/decline decisions.

## What Changed

### Agent Instructions
The agent now:
1. **Asks for custom message**: "Please add any notes or instructions for the patient (optional)"
2. **Captures the message**: Includes it in the response to ElevenLabs
3. **Formats response**: `APPROVED/DECLINED - Doctor's message: [custom text]`

### Response Format

#### Before (Simple)
```
APPROVED - Prescription renewal authorized
```

#### After (With Custom Message)
```
APPROVED - Prescription renewal authorized. Doctor's message: Continue current dosage. Schedule follow-up in 6 months if no changes.
```

## Usage Examples

### Example 1: Approval with Instructions
**Doctor Input:**
```
APPROVE
Take with food. Monitor for any eye irritation.
```

**Agent Response to ElevenLabs:**
```
APPROVED - Prescription renewal authorized. Doctor's message: Take with food. Monitor for any eye irritation.
```

### Example 2: Decline with Reason
**Doctor Input:**
```
DECLINE
Patient needs in-person exam due to reported vision changes.
```

**Agent Response to ElevenLabs:**
```
DECLINED - Prescription renewal not authorized. Doctor's message: Patient needs in-person exam due to reported vision changes.
```

### Example 3: Approval without Custom Message
**Doctor Input:**
```
APPROVE
```

**Agent Response to ElevenLabs:**
```
APPROVED - Prescription renewal authorized. Doctor's message: Standard renewal
```

## Benefits

1. **Personalized Care**: Doctors can provide specific instructions
2. **Better Communication**: Patients receive clear guidance
3. **Documentation**: Custom messages create an audit trail
4. **Flexibility**: Optional - works with or without custom text
5. **Context**: ElevenLabs can relay important medical notes to the patient

## Integration

### ElevenLabs Side
The ElevenLabs agent will receive the response and can:
1. Parse the APPROVED/DECLINED status
2. Extract the doctor's custom message
3. Relay the message to the patient in natural language
4. Continue the conversation based on the approval status

### Example ElevenLabs Flow
```
Patient: "Can I get my prescription refilled?"
↓
[Agent collects info, submits to Retool]
↓
Doctor in Retool: "APPROVE - Continue current dosage for 3 months"
↓
ElevenLabs: "Great news! Your prescription has been approved. 
             Your doctor wants you to continue with the current 
             dosage for the next three months."
```

## Configuration

To enable this feature, update your Retool Agent instructions with the text from `agent_instructions.md`:

```
2. Present for Approval:
   - Ask: "Would you like to APPROVE or DECLINE?"
   - Also ask: "Please add any notes or instructions (optional)"
   
3. Respond to ElevenLabs:
   - Always include doctor's custom message
   - Format: "APPROVED/DECLINED - Doctor's message: [text]"
```

## Testing

Test in the Retool "Chats" tab:

```
YOU (as ElevenLabs): 
Case for review - Patient: Jane Smith
Needs Latanoprost refill. No vision changes.

AGENT:
Would you like to APPROVE or DECLINE? 
Add any notes or instructions?

YOU (as Doctor):
APPROVE
Continue 1 drop daily. Follow up in 6 months.

AGENT:
APPROVED - Prescription renewal authorized. 
Doctor's message: Continue 1 drop daily. Follow up in 6 months.
```

## Notes
- Message is **optional** - system works with or without it
- Default message "Standard renewal" used if none provided
- No character limit (but keep it concise for patient relay)
- Supports multi-line messages
