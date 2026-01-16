# Macroscope AI Rules for RenewRx

This file defines the engineering standards and review priorities for the RenewRx project. Macroscope should use these rules when reviewing Pull Requests.

## 1. AI Agent Robustness
- **Error Handling**: All tool calls (ElevenLabs, Yutori, TinyFish) MUST have explicit try-catch blocks or error checks. Never assume an API call returns success.
- **Timeouts**: Web automation tasks (Yutori/TinyFish) should have defined timeouts to prevent hanging processes.
- **State Management**: Verify that agent state is correctly passed between the voice intake and the web automation layers.

## 2. Security & Privacy (Healthcare Focus)
- **PII Protection**: Never log raw patient data (Names, SSNs, DOBs). Ensure only synthetic IDs from the Tonic dataset are used in logs.
- **Credential Safety**: Ensure no API keys or secrets are committed. Check that new services use `secrets.env` or environment variables.

## 3. Web Automation (AgentQL/Yutori)
- **Element Discovery**: Prefer robust selectors (like those used in AgentQL) over fragile CSS paths.
- **Idempotency**: Ensure that ordering actions (like pharmacy checkout) are idempotent or have checks to prevent accidental duplicate orders.

## 4. Documentation
- **Sync with Status**: Any changes to core agent logic should be reflected in `IMPLEMENTATION_STATUS.md`.
- **Demo Integrity**: Ensure that changes do not break the "Pre-baked" demo flow defined in `DEMO_GUIDE.md`.
