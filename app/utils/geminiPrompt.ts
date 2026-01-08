/**
 * Builds a structured prompt for Gemini AI
 * Converts natural language into a strict JSON-based schedule
 * Specific to Dincharya project
 */
export function buildGeminiPrompt(userPrompt: string): string {
  return `
You are an AI assistant that converts student daily plans into structured schedules.

User input:
"${userPrompt}"

Instructions:
- Understand the user's intent.
- If information is missing, make reasonable assumptions.
- Do NOT ask questions.
- Output ONLY valid JSON.
- Do NOT include explanations or extra text.

Required JSON format:
{
  "tasks": [
    {
      "title": "string",
      "startTime": "HH:MM",
      "endTime": "HH:MM",
      "category": "study | break | personal | other"
    }
  ]
}
`;
}
