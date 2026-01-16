import type { Context, Config } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    // Handle multiple possible key names from ElevenLabs vs direct calls
    const medication = body.medication_name || body.medicationName || body.medication;
    const patient_name = body.patient_name || body.patientName;

    if (!medication || !patient_name) {
      return new Response(JSON.stringify({ error: "Missing medicationName or patientName" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const YUTORI_API_KEY = process.env.YUTORI_API_KEY;
    if (!YUTORI_API_KEY) {
      return new Response(JSON.stringify({ error: "YUTORI_API_KEY not configured on server" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const PHARMACY_URL = "https://renewrx-mocks-demo-2026.netlify.app/pharmacy/index.html";

    // Instructions for Yutori Agent (Navigator)
    const instructions = `
      1. Navigate to ${PHARMACY_URL}.
      2. Type "${medication}" into the search bar (#med-search) and click the search button (#search-btn).
      3. Locate the medication in the results and click the "Add to Cart" button (.add-to-cart-btn).
      4. Click the "Proceed to Checkout" button (#checkout-btn).
      5. In the checkout form, enter "${patient_name}" in the Full Name field (#name).
      6. Enter "123 Wellness Ave, Healthy City, HC 90210" in the Shipping Address field (#address).
      7. Click the "Place Order & Pay" button (#place-order-btn).
      8. Once the confirmation appears, extract the Order ID from the text (it starts with "ORD-") and return it.
    `.trim();

    console.log(`Triggering Yutori Agent for ${medication} and ${patient_name}`);

    // Trigger the Navigator run
    const response = await fetch("https://api.yutori.com/v1/navigator/runs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": YUTORI_API_KEY,
      },
      body: JSON.stringify({
        instructions: instructions,
        wait_for_completion: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Yutori API Error:", errorText);
      return new Response(JSON.stringify({ error: "Yutori API failed", details: errorText }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    return new Response(JSON.stringify({
      status: "success",
      message: "Order placed successfully via Yutori Cloud Agent",
      order_id: result.output || "ORD-PENDING",
      details: result
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Internal Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: "/place-order"
};
