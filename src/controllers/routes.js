const { PUBLIC_KEY } = require('../utils/config');

const express = require('express');
const router = express.Router();
const {
  verifyKeyMiddleware,
  InteractionType,
  InteractionResponseType,
} = require('discord-interactions');

router.post(
  '/interactions',
  verifyKeyMiddleware(PUBLIC_KEY),
  async (request, response, next) => {
    const { id, type, data } = request.body;
    console.log(request.body);

    if (type === InteractionType.PING) {
      return res.send({ type: InteractionResponseType.PONG });
    }
  }
);

router.post(
  '/webhook',
  verifyKeyMiddleware(PUBLIC_KEY),
  async (request, response) => {
    const { type } = request.body;
    console.log(request.body);
    if (type === 0) {
      return res.status(204).send({});
    }

    if (type === 1) {
      console.log('evento');
      console.log(request.body.event);
    }
  }
);

module.exports = router;
