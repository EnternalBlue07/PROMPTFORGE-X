import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PromptAnalysis } from "../types";

// Define the schema for the Gemini response to ensure strict JSON output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    autopsy: {
      type: Type.OBJECT,
      properties: {
        issues: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of bullet points explaining what is wrong with the prompt.",
        },
      },
      required: ["issues"],
    },
    classification: {
      type: Type.OBJECT,
      properties: {
        granularity: { type: Type.STRING, description: "Nano, Micro, Macro, Mega, or God-tier" },
        functionType: { type: Type.STRING, description: "Instructional, Creative, Analytical, etc." },
        riskLevel: { type: Type.STRING, description: "Safe, Confusing, Hallucination-prone, etc." },
      },
      required: ["granularity", "functionType", "riskLevel"],
    },
    frameworkScores: {
      type: Type.OBJECT,
      properties: {
        clear: { type: Type.INTEGER, description: "Score 0-10" },
        crisp: { type: Type.INTEGER, description: "Score 0-10" },
        costar: { type: Type.INTEGER, description: "Score 0-10" },
        rtf: { type: Type.INTEGER, description: "Score 0-10" },
        reactCompatibility: { type: Type.INTEGER, description: "Score 0-10" },
        chainOfThought: { type: Type.BOOLEAN },
      },
      required: ["clear", "crisp", "costar", "rtf", "reactCompatibility", "chainOfThought"],
    },
    rewrites: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          style: { type: Type.STRING, description: "Name of the style (e.g., Clean Professional)" },
          content: { type: Type.STRING, description: "The rewritten prompt content" },
        },
        required: ["style", "content"],
      },
    },
    scorecard: {
      type: Type.OBJECT,
      properties: {
        clarity: { type: Type.INTEGER, description: "Score 0-10" },
        control: { type: Type.INTEGER, description: "Score 0-10" },
        expandability: { type: Type.INTEGER, description: "Score 0-10" },
        modelFriendliness: { type: Type.INTEGER, description: "Score 0-10" },
        verdict: { type: Type.STRING, description: "One-line verdict" },
        upgradeTip: { type: Type.STRING, description: "One-line upgrade tip" },
      },
      required: ["clarity", "control", "expandability", "modelFriendliness", "verdict", "upgradeTip"],
    },
  },
  required: ["autopsy", "classification", "frameworkScores", "rewrites", "scorecard"],
};

export const analyzePrompt = async (
  userPrompt: string,
  isCrazyMode: boolean
): Promise<PromptAnalysis> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const crazyModeInstructions = isCrazyMode
    ? `
    CRAZY MODE ENABLED:
    - Be ruthless.
    - Roast bad prompts.
    - Use sharp language (non-abusive but stinging).
    - Treat vague prompts as crimes against logic.
    - Your 'verdict' and 'issues' should be biting and sarcastic if the prompt is poor.
    `
    : `
    PROFESSIONAL MODE:
    - Be constructive and educational.
    - Tone should be that of a senior engineer mentoring a junior.
    `;

  const systemInstruction = `
    You are PROMPTFORGE-X, an extreme prompt engineering analysis engine.
    Your role is to dissect, judge, classify, criticize, and reconstruct prompts.
    
    ${crazyModeInstructions}

    Perform the following steps:
    1. PROMPT AUTOPSY: Identify ambiguity, missing context, hidden assumptions, etc.
    2. PROMPT CLASSIFICATION: Granularity, Function, Risk.
    3. FRAMEWORK MAPPING: Score against CLEAR, CRISP, CO-STAR, RTF.
    4. RECONSTRUCTION: Rewrite in 5 styles: Clean Professional, Creative Power, Ultra-Constrained, Exploratory, God-Mode Meta.
    5. SCORECARD: Final scores and verdict.

    Input Prompt: "${userPrompt}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt, // The user's prompt is the "content" we analyze
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: isCrazyMode ? 0.9 : 0.4, // Higher temp for crazy mode creativity
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as PromptAnalysis;
    } else {
      throw new Error("No response text generated.");
    }
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};