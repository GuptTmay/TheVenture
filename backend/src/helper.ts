import { BotMail } from "./config";
import nodemailer from "nodemailer";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function sendOtp(email: string) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: BotMail.user,
      pass: BotMail.pass,
    },
  });

  await transporter.sendMail({
    from: `"The Venture" <${BotMail.user}>`,
    to: email,
    subject: "Verification OTP",
    text: `Your OTP is: ${otp}`,
    html: `
    <div style="font-family: Arial, sans-serif; padding: 10px;">
      <h2>Hello, User</h2>
      <p>Your OTP is:</p>
      <h1 style="color: #4CAF50;">${otp}</h1>
      <p>This OTP is valid for 30 Seconds.</p>
    </div>
  `,
  });

  return otp;
}

export const Status = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  LOADING: "loading",
};

// types.ts
export interface BlogContent {
  title: string;
  content: string;
}


export async function getAiBlog(topic: string): Promise<BlogContent | null> {
  const prompt = `Write a short blog markdown heavy post about "${topic}"`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "An engaging, SEO-friendly title"
            },
            content: {
              type: Type.STRING,
              description: "Well-formatted markdown content"
            }
          },
          required: ["title", "content"],
          propertyOrdering: ["title", "content"]
        },
      },
    });

    if (!response.text) {
      throw new Error('No response received from AI service');
    }

    const parsed = JSON.parse(response.text);
    // console.log(parsed); 
    // Validate response structure
    if (!parsed.title || !parsed.content) {
      throw new Error('Invalid response structure from AI service');
    }

    return {
      title: parsed.title.trim(),
      content: parsed.content.trim()
    };

  } catch (error) {
    console.error('AI Blog Generation Error:', error);
    
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse AI response');
    }
   
    throw new Error('Failed to generate blog content');
  }
}