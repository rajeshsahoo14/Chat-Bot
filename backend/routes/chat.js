const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const auth = require('../middleware/auth');
const ChatHistory = require('../models/ChatHistory');

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `You are a helpful medical assistant chatbot. Your role is to:
1. Help predict possible diseases based on symptoms described by users
2. Suggest which type of doctor to consult (e.g., General Physician, Cardiologist, Dermatologist, etc.)
3. Provide general precautions and health advice
4. Support multiple languages: English, Kannada, and Hindi

IMPORTANT GUIDELINES:
- Always clarify that you're providing general information, not a diagnosis
- Recommend consulting a qualified healthcare professional for proper diagnosis
- Be empathetic and supportive
- If symptoms seem serious or emergency-related, strongly advise immediate medical attention
- Provide precautions that are safe and generally applicable
- When suggesting doctors, be specific about the specialty

Format your responses clearly with:
- Possible conditions (if applicable)
- Recommended doctor type
- General precautions
- When to seek immediate care

Always maintain a professional, caring tone.`;

router.post('/message', auth, async (req, res) => {
  try {
    const { message, language = 'English' } = req.body;
    const userId = req.user.id;

    console.log(`📩 Received message from user ${userId}`);

    // Get or create chat history
    let chatHistory = await ChatHistory.findOne({ userId });
    if (!chatHistory) {
      chatHistory = new ChatHistory({ userId, messages: [] });
    }

    // Add user message to history
    chatHistory.messages.push({
      role: 'user',
      content: message
    });

    // Prepare messages for Groq
    const messages = [
      { 
        role: 'system', 
        content: SYSTEM_PROMPT + `\n\nIMPORTANT: Please respond in ${language} language.` 
      }
    ];

    // Add recent conversation history (last 10 messages for context)
    const recentMessages = chatHistory.messages.slice(-11, -1);
    recentMessages.forEach(msg => {
      messages.push({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      });
    });

    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

    console.log('🤖 Sending request to Groq...');

    // Get response from Groq
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // Fast and accurate model
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false
    });

    const response = completion.choices[0].message.content;

    console.log('✅ Received response from Groq');

    // Add assistant response to history
    chatHistory.messages.push({
      role: 'assistant',
      content: response
    });

    await chatHistory.save();

    res.json({
      response,
      timestamp: new Date()
    });

  } catch (err) {
    console.error('❌ Chat error:', err.message);
    
    let errorMessage = 'Sorry, I encountered an error. ';
    
    if (err.message.includes('API key')) {
      errorMessage = 'API key is invalid. Please check your Groq API key.';
    } else if (err.message.includes('rate_limit')) {
      errorMessage = 'Rate limit exceeded. Please wait a moment.';
    } else if (err.message.includes('quota')) {
      errorMessage = 'API quota exceeded.';
    } else {
      errorMessage += 'Please try again.';
    }
    
    res.status(500).json({ message: errorMessage });
  }
});

// Get chat history
router.get('/history', auth, async (req, res) => {
  try {
    const chatHistory = await ChatHistory.findOne({ userId: req.user.id });
    res.json(chatHistory || { messages: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching chat history' });
  }
});

// Clear chat history
router.delete('/history', auth, async (req, res) => {
  try {
    await ChatHistory.findOneAndDelete({ userId: req.user.id });
    res.json({ message: 'Chat history cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error clearing chat history' });
  }
});

module.exports = router;