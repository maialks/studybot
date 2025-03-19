require('dotenv').config({ path: '.env' });

const express = require('express');
const router = express.Router();
const {
  verifyKeyMiddleware,
  InteractionType,
  InteractionResponseFlags,
  InteractionResponseType,
} = require('discord-interactions');
// const { PUBLIC_KEY } = process.env;

router.post(
  '/interactions',
  verifyKeyMiddleware(process.env.PUBLIC_KEY),
  (request, response) => {
    const { id, type, data } = request.body;

    if (type === InteractionType.PING) {
      return res.send({ type: InteractionResponseType.PONG });
    }
  }
);

router.post('/', (request, response) => {
  response.status(201).send();
});

module.exports = router;
