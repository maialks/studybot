require('dotenv').config({ path: '.env' });
const express = require('express');
const app = express();

app.post('/interactions', (request, response) => {
  response.status(200).send();
});

app.post('/', (request, response) => {
  response.status(201).send();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on port ${PORT}`);
});
