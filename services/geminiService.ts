
import { GoogleGenAI } from "@google/genai";

/**
 * Edits an image using Gemini 2.5 Flash Image.
 * @param base64ImageData The image to edit in base64 format.
 * @param mimeType The mime type of the image.
 * @param prompt The editing instruction.
 * @returns The edited image base64.
 */
export const editImageWithGemini = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please ensure it is configured.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData.split(',')[1] || base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: `Please edit this property image according to this instruction: ${prompt}. Return ONLY the edited image.`,
          },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error editing image with Gemini:", error);
    throw error;
  }
};
