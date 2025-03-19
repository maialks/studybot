require('dotenv').config({ path: '.env' });

const express = require('express');
const router = express.Router();
const axios = require('axios');
const {
  verifyKeyMiddleware,
  InteractionType,
  InteractionResponseFlags,
  InteractionResponseType,
} = require('discord-interactions');

router.post(
  '/interactions',
  verifyKeyMiddleware(process.env.PUBLIC_KEY),
  (request, response) => {
    const { id, type, data } = request.body;
    console.log(request.body);

    if (type === InteractionType.PING) {
      return res.send({ type: InteractionResponseType.PONG });
    }
  }
);

router.post(
  'webhook',
  verifyKeyMiddleware(process.env.PUBLIC_KEY),
  async (request, response) => {
    const { content, channelId, author } = request.body;
    console.log(request.body);
    if (type === InteractionType.PING) {
      return res.send({ type: InteractionResponseType.PONG });
    }
  }
);

module.exports = router;
