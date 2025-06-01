const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

exports.getChatbotResponse = async (req, res) => {
  try {
    const { message, hotelContext } = req.body;

    const response = await openai.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages: [
        { role: 'system', content: 'You are a helpful hotel assistant.' },
        { role: 'user', content: `Context: ${JSON.stringify(hotelContext)}\n\nQuestion: ${message}` },
      ],
    });

    res.json({
      success: true,
      response: response.choices[0].message.content,
    });
  } catch (error) {
    console.error('Chatbot API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting response from chatbot',
      error: error.message,
    });
  }
}; 