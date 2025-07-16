import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

export async function main(userPrompt) {

  console.log("[AI.js] main function called with prompt:", userPrompt); // Log entry
  const token = process.env.AI_KEY; // Access process.env.AI_KEY directly here

  if (!token) {
    console.error("Azure AI Key (AI_KEY) is not set in environment variables.");
    throw new Error("AI service authentication key is missing.");
  }
  const client = ModelClient(endpoint, new AzureKeyCredential(token));

  let response;
  try {
    response = await client.path("/chat/completions").post({
      body: {
        messages: [
          {
            role: "system",
            content: "You are CONVERTTO, a specialized AI assistant. Your primary functions are: " +
                     "1. Perform unit conversions if a user can't find what they need in the predefined categories. " +
                     "2. Provide live exchange rates for national currencies and cryptocurrencies. " +
                     "3. Perform currency conversions based on these live exchange rates. " +
                     "4. Offer historical data on currencies, such as average price fluctuations over various periods (days, months, years). " +
                     "Be precise, helpful, and focus on these financial and conversion-related tasks."
          },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7, // Adjusted for more balanced responses
        top_p: 1,
        model: model,
      },
    });
    console.log("[AI.js] Received response from Azure AI service status:", response.status);
  } catch (networkOrClientError) {
    // This catches errors during the request itself (network, client misconfiguration before HTTP call)
    console.error("[AI.js] Azure AI Inference client error during POST:", networkOrClientError);
    throw new Error(`AI service request failed: ${networkOrClientError.message}`);
  }

  if (isUnexpected(response)) {
    // This means the HTTP request was made, but the status code indicates an error (e.g., 4xx, 5xx)
    console.error("[AI.js] Azure AI Inference service returned an unexpected status:", response.status);
    // Log the raw body if possible, attempting JSON.stringify as a fallback
    let errorBodyDetail = response.body;
    try {
      errorBodyDetail = JSON.stringify(response.body, null, 2);
    } catch (e) { /* ignore if body is not stringifiable */ }
    console.error("Azure AI Inference error response body:", errorBodyDetail);

    let errorMessage = `AI service returned an error. Status: ${response.status}`;
    if (response.body && response.body.error) {
      if (typeof response.body.error === 'string') {
        errorMessage = response.body.error;
      } else if (response.body.error.message && typeof response.body.error.message === 'string') {
        errorMessage = response.body.error.message;
      } else {
        errorMessage = `AI service error: Status ${response.status}`;
      }
    } else if (typeof response.body === 'string' && response.body.trim() !== '') {
      errorMessage = response.body;
    }
    throw new Error(errorMessage);
  }

  if (!response.body || !response.body.choices || !Array.isArray(response.body.choices) || response.body.choices.length === 0) {
    // The request was successful (e.g. 200 OK) but the body structure is not what we expect.
    console.error("[AI.js] Azure AI Inference service returned an unexpected response structure (missing choices):", JSON.stringify(response.body, null, 2));
    throw new Error("AI service returned an empty or invalid choices array.");
  }

  const firstChoice = response.body.choices[0];
  if (!firstChoice.message || typeof firstChoice.message.content !== 'string') {
    console.error("[AI.js] Azure AI Inference service returned an unexpected response structure (missing message content):", JSON.stringify(response.body, null, 2));
    throw new Error("AI service response's first choice is missing message content.");
  }

  console.log("[AI.js] Successfully processed AI response:", firstChoice.message.content);
  return firstChoice.message.content;
}
