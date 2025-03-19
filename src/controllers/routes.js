require('dotenv').config({ path: '.env' });

const express = require('express');
const router = express.Router();
// const { verifyKeyMiddleware } = require('discord-interactions');
// const { PUBLIC_KEY } = process.env;

router.post('/interactions', (request, response) => {
  response.status(200).send();
});

router.post('/', (request, response) => {
  response.status(201).send();
});

module.exports = router;
