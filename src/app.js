require('dotenv').config({ path: '.env' });
const express = require('express');
const app = express();
const router = require('./controllers/routes');
const { requestLogger } = require('./utils/logger');

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(requestLogger);
app.use('/', router);
module.exports = app;
