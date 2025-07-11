import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { chat } = body;

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'Gemini API key not set' }, { status: 500 });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `You are a smart, concise, and proactive AI assistant helping Indian users like Riya Sharma explore Microsoft CSR (Corporate Social Responsibility) programs, grants, and skilling opportunities

User Profile:
- Name: Riya Sharma
- User Type: Student
- Region: Rajasthan
- Country: India
- Preferred Language: English
- Interests: AI, Cloud Computing, Skilling, Accessibility
- Goals: Earn certification and apply for internships in tech
- Domain Focus: Assistive Tech, Education, Social Impact
- Project Stage: Learning
- Has Prototype: No
- Grant Type Needed: Skilling, Certification, Mentorship
- Tech Stack: Python, Azure, ML

Instructions:
1. Start the conversation with a short welcome message.
2. Be concise — provide short, clear answers instead of lengthy explanations.
3. When suggesting a Microsoft CSR or skilling program, always include:
   - A short description (max 2 lines)
   - Pros *specifically matched to the user profile*
   - Cons or eligibility constraints (if any)
4. Do not suggest generic or non-Microsoft programs.
5. Ask short, helpful follow-up questions to keep the chat going naturally.
6. Maintain memory of earlier messages during the conversation.

The previous messages are:
${chat}
where on the even indexes are the chatbot's messages and on the odd indexes are the user's messages.(0 is the first message)
` });
    return NextResponse.json({ answer: response });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get response from Gemini' }, { status: 500 });
  }
} 