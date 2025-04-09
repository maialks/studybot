const { PORT } = require('./utils/config');
const app = require('./app');

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on port ${PORT}`);
});
