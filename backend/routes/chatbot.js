const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/', async (req, res) => {
  const { chat, user } = req.body;
  if (!chat || !Array.isArray(chat)) {
    return res.status(400).json({ error: 'Invalid chat history' });
  }
  try {
    // Build user profile string from user object
    const userProfile = user ? `
User Profile:
- Name: ${user.name || ''}
- User Type: ${user.userType || ''}
- Region: ${user.region || ''}
- Country: ${user.country || ''}
- Preferred Language: ${user.preferredLanguage || ''}
- Interests: ${(user.interests || []).join(', ')}
- Goals: ${user.goals || ''}
- Domain Focus: ${user.domainFocus || ''}
- Project Stage: ${user.projectStage || ''}
- Has Prototype: ${user.hasPrototype ? 'Yes' : 'No'}
- Grant Type Needed: ${(user.grantTypeNeeded || []).join(', ')}
- Tech Stack: ${(user.techStack || []).join(', ')}
` : '';
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `You are a smart, concise, and proactive AI assistant helping users explore Microsoft CSR (Corporate Social Responsibility) programs, grants, and skilling opportunities
${userProfile}
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
    res.json({ answer: response });
  } catch (error) {
    console.error('Gemini API error:', error);
    console.error('GEMINI_API_KEY present:', !!process.env.GEMINI_API_KEY);
    res.status(500).json({ error: 'Failed to get response from Gemini', details: error.message });
  }
});

module.exports = router; 