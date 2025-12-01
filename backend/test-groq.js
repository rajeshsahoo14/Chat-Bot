const Groq = require('groq-sdk');
require('dotenv').config();

async function testGroq() {
  try {
    console.log('🔑 Groq API Key:', process.env.GROQ_API_KEY ? 'Found ✅' : 'NOT FOUND ❌');
    
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
    
    console.log('\n📡 Testing Groq API...');
    
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say hello in one sentence.' }
      ],
      temperature: 0.7,
      max_tokens: 100
    });
    
    const response = completion.choices[0].message.content;
    
    console.log('✅ SUCCESS! Groq API is working');
    console.log('📝 Response:', response);
    console.log('\n🎉 Your medical chatbot is ready to use!');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.log('\n💡 Solution:');
    console.log('1. Get API key from: https://console.groq.com/');
    console.log('2. Add to .env file as: GROQ_API_KEY=gsk_your_key_here');
    console.log('3. Make sure there are no spaces or quotes around the key');
  }
}

testGroq();