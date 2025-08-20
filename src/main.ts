import { App } from './App';
import logger from './utils/general/logger';

const app = new App();
app.start().catch((error) => logger.error(error));
