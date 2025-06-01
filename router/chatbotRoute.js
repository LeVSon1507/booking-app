const express = require('express');
const router = express.Router();
const { getChatbotResponse } = require('../controllers/chatbotController');

router.post('/chatbot/chat', getChatbotResponse);

module.exports = router; 