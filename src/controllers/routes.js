require('dotenv').config({ path: '.env' });

const express = require('express');
const router = express.Router();
// const { verifyKeyMiddleware } = require('discord-interactions');
// const { PUBLIC_KEY } = process.env;

router.post('/interactions', (request, response, error, next) => {
  console.log(request);
  response.status(201).end();
});

module.exports = router;
