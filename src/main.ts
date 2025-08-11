import { App } from './App';
import logger from './utils/logger';

const app = new App();
app.start().catch((error) => logger.error(error));
