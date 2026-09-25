import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const GEMINI_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
];

const MAX_RETRIES_PER_MODEL = 2;

function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured in the environment"
    );
  }

  return new GoogleGenerativeAI(apiKey);
}

function isTemporaryError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message : String(error);

  return (
    message.includes("503") ||
    message.includes("429") ||
    message.includes("500") ||
    message.includes("502") ||
    message.includes("504") ||
    message.toLowerCase().includes("service unavailable") ||
    message.toLowerCase().includes("high demand") ||
    message.toLowerCase().includes("temporarily")
  );
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithFallback(
  prompt: string
): Promise<string> {
  const genAI = getGeminiClient();

  let lastError: unknown;

  for (const modelName of GEMINI_MODELS) {
    for (
      let attempt = 1;
      attempt <= MAX_RETRIES_PER_MODEL;
      attempt++
    ) {
      try {
        console.log(
          `Gemini request: ${modelName} (attempt ${attempt})`
        );

        const model = genAI.getGenerativeModel({
          model: modelName,
        });

        const result = await model.generateContent(prompt);

        const text = result.response.text().trim();

        if (!text) {
          throw new Error(
            `Gemini ${modelName} returned an empty response`
          );
        }

        console.log(`Gemini request succeeded: ${modelName}`);

        return text;
      } catch (error) {
        lastError = error;

        console.error(
          `Gemini ${modelName} failed on attempt ${attempt}:`,
          error instanceof Error ? error.message : error
        );

        if (!isTemporaryError(error)) {
          throw error;
        }

        if (attempt < MAX_RETRIES_PER_MODEL) {
          await wait(1500);
        }
      }
    }

    console.log(
      `Switching from ${modelName} to the next Gemini model...`
    );
  }

  throw new Error(
    lastError instanceof Error
      ? `All Gemini models are temporarily unavailable. Last error: ${lastError.message}`
      : "All Gemini models are temporarily unavailable."
  );
}

export async function generateAgentInstructions(
  businessRequirement: string
): Promise<string> {
  if (!businessRequirement.trim()) {
    throw new Error("Business requirement is required");
  }

  const prompt = `
You are the AI configuration engine for CallForge.

CallForge is a no-code AI voice-agent platform for businesses.

The business user provides a simple description of what they want their
AI calling agent to do.

Convert the business requirement into clear, production-ready
AI voice-agent instructions.

The instructions should define:

1. The agent's role
2. The purpose of the calls
3. How the agent should introduce itself
4. What information it should collect
5. Questions it should ask
6. How it should understand customer intent
7. How it should identify qualified leads
8. How it should handle unclear answers
9. How it should handle customer objections or concerns
10. When the conversation should end
11. What information should be summarized after the call

Important rules:

- Be professional and natural.
- Do not make the agent sound robotic.
- Keep conversations concise.
- Do not pressure customers.
- Never invent information that the business has not provided.
- Ask one question at a time.
- Adapt to the customer's responses.
- Make the instructions suitable for a voice conversation.
- Do not include unnecessary technical implementation details.

Business requirement:

${businessRequirement}

Return only the final agent instructions.
Do not add explanations before or after the instructions.
`;

  return generateWithFallback(prompt);
}

export async function analyzeCallTranscript(
  transcript: string
): Promise<{
  intent: string;
  outcome: string;
  leadGenerated: boolean;
  leadScore: number;
}> {
  if (!transcript.trim()) {
    throw new Error("Call transcript is required");
  }

  const prompt = `
Analyze the following AI voice-agent call transcript.

Identify:

- customer intent
- call outcome
- whether a lead was generated
- lead qualification score from 0 to 100

Return ONLY valid JSON using exactly this structure:

{
  "intent": "string",
  "outcome": "string",
  "leadGenerated": true,
  "leadScore": 0
}

Rules:

- leadScore must be a number between 0 and 100.
- leadGenerated must be true or false.
- Do not include markdown.
- Do not include additional fields.

Call transcript:

${transcript}
`;

  const text = await generateWithFallback(prompt);

  const cleanedText = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");

  let parsed: {
    intent: string;
    outcome: string;
    leadGenerated: boolean;
    leadScore: number;
  };

  try {
    parsed = JSON.parse(cleanedText);
  } catch {
    throw new Error(
      "Gemini returned invalid call-analysis JSON"
    );
  }

  return {
    intent: parsed.intent,
    outcome: parsed.outcome,
    leadGenerated: Boolean(parsed.leadGenerated),
    leadScore: Math.max(
      0,
      Math.min(100, Number(parsed.leadScore) || 0)
    ),
  };
}