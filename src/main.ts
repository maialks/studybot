import { App } from './App.js';
import logger from './utils/general/logger.js';

const app = new App();
app.start().catch((error) => logger.error(error));

// Captura erros globais não tratados
process.on('unhandledRejection', (reason, _promise) => {
  logger.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('SIGINT', async () => {
  logger.info('Encerrando aplicação...');
  process.exit(0);
});
