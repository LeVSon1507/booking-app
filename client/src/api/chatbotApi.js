import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:9000';

const chatbotApi = {
  sendMessage: async (message, hotelContext) => {
    try {
      const response = await axios.post(`${API_URL}/api/chatbot/chat`, {
        message,
        hotelContext
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default chatbotApi; 