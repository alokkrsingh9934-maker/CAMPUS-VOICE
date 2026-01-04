import { GoogleGenAI, Type } from "@google/genai";
import { Complaint, AISummary } from "../types";

export const getVCExecutiveSummary = async (complaints: Complaint[]): Promise<AISummary> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const complaintText = complaints.map(c => 
    `Category: ${c.category}${c.department ? ` (Dept: ${c.department})` : ''}, Subject: ${c.subject}, Description: ${c.description}, Status: ${c.status}`
  ).join('\n---\n');

  const prompt = `
    As an AI Executive Assistant to the Vice Chancellor, analyze these student grievances and provide a VERY CONCISE executive brief.
    
    COMPLAINTS DATA:
    ${complaintText}

    TASK:
    1. Generate a brief, high-impact bulleted summary (MAX 3-4 BULLETS) of the most urgent institutional issues. Keep it strictly under 100 words.
    2. Calculate institutional sentiment scores (0-100) for major categories: Mess, Hostel, Faculty, Facilities, Infrastructure.
    3. Provide an overall health score (0-100).
    4. Provide empty or minimal department scores as they are no longer the primary focus.

    Brevity is the absolute priority. Focus only on critical trends.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            report: { 
              type: Type.STRING, 
              description: "A VERY CONCISE bulleted summary of grievances." 
            },
            overallHealth: { 
              type: Type.NUMBER, 
              description: "Overall institution satisfaction score from 0-100." 
            },
            categoryScores: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Category name" },
                  score: { type: Type.NUMBER, description: "Score 0-100" }
                },
                required: ["name", "score"]
              }
            },
            deptScores: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  dept: { type: Type.STRING },
                  score: { type: Type.NUMBER }
                },
                required: ["category", "dept", "score"]
              }
            }
          },
          required: ["report", "overallHealth", "categoryScores", "deptScores"]
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("AI returned an empty response body.");
    }

    return JSON.parse(textOutput) as AISummary;
  } catch (error) {
    console.error("Gemini AI Summary Error:", error);
    return {
      report: "• Temporary connectivity issue with the AI engine.\n• High volume of tickets may cause delays.\n• Please refresh to attempt regeneration.",
      overallHealth: 0,
      categoryScores: [
        { name: "Mess", score: 0 },
        { name: "Hostel", score: 0 },
        { name: "Faculty", score: 0 },
        { name: "Facilities", score: 0 },
        { name: "Infrastructure", score: 0 }
      ],
      deptScores: [],
    };
  }
};