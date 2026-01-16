# Cloud Agent Configuration Guide

Use these prompts and configurations to set up your agents in the **TinyFish** and **Yutori** cloud consoles.

## 1. TinyFish (AgentQL) Task
**Goal**: Scrape patient history from the mock EMR.

1.  **Create a New Task** in TinyFish.
2.  **Target URL**: `https://<YOUR-CLOUD-RUN-URL>/portal/index.html` (Update after deployment)
3.  **Prompt**:
    ```text
    1. Log in to the portal using username "demo" and password "demo123".
    2. Click the "Sign In" button.
    3. Wait for the "Prescription History" table to load.
    4. Extract the following data for the medication "Latanoprost":
       - The Date of the last refill.
       - The Prescriber's name.
    5. Also extract the list of Allergies.
    ```
4.  **Output Schema (JSON)**:
    ```json
    {
      "medication": "Latanoprost",
      "last_refill_date": "YYYY-MM-DD",
      "prescriber": "string",
      "allergies": ["string"]
    }
    ```
5.  **Save** and note the **Task ID** and **API Endpoint**.

---

## 2. Yutori Agent
**Goal**: Place a refill order on the mock Pharmacy.

1.  **Create a New Agent** in Yutori.
2.  **Target URL**: `https://<YOUR-CLOUD-RUN-URL>/pharmacy/index.html` (Update after deployment)
3.  **Instructions**:
    ```text
    1. Go to the pharmacy homepage.
    2. Type "Latanoprost" into the search bar and submit.
    3. Find the "Latanoprost" product card and click "Add to Cart".
    4. Click "Proceed to Checkout".
    5. Fill in the "Full Name" field with the variable {{patient_name}}.
    6. Fill in "Shipping Address" with "123 Wellness Ave".
    7. Click "Place Order & Pay".
    8. On the confirmation page, locate the Order ID (starts with "ORD-").
    9. Return the Order ID as the final output.
    ```
4.  **Save** and note the **Webhook URL**.

---

## 3. ElevenLabs Tool Configuration
**Goal**: Connect the Voice Agent to the TinyFish Task.

1.  **Go to ElevenLabs > Agents > Tools**.
2.  **Create Tool**: `check_history`
3.  **Method**: `POST`
4.  **URL**: `https://api.tinyfish.io/v1/tasks/<TASK_ID>/run` (Check TinyFish docs for exact endpoint)
5.  **Headers**:
    - `Authorization`: `Bearer <YOUR_TINYFISH_API_KEY>`
6.  **Body**:
    ```json
    {
      "variables": {
        "patient_name": "{{name}}" 
      }
    }
    ```

## 4. Retool Workflow Step
**Goal**: Connect the "Approve" button to the Yutori Agent.

1.  **Create a Resource** in Retool for `Yutori API`.
2.  **Base URL**: `https://api.yutori.com/v1`
3.  **Header**: `x-api-key: <YOUR_YUTORI_KEY>`
4.  **In the Workflow**, add a Resource Query:
    - **Endpoint**: `POST /runs`
    - **Body**:
      ```json
      {
        "agent_id": "<YOUR_YUTORI_AGENT_ID>",
        "variables": {
          "patient_name": "{{ current_case.patient_name }}"
        }
      }
      ```
