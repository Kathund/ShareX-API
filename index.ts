import { errorMessage, otherMessage } from './src/logger';
import { loadEndpoints } from './src/helper';
import fileUpload from 'express-fileupload';
import { existsSync, mkdirSync } from 'fs';
import { PORT } from './config.json';
import express from 'express';

if (!existsSync('./src/files')) {
  mkdirSync('./src/files');
}

const app = express();
try {
  app.use(fileUpload());
  const result = loadEndpoints(app);
  if (result !== undefined) {
    otherMessage(`Loaded ${result.loaded} endpoints`);
  } else {
    otherMessage('No endpoints found');
  }
  app.listen(PORT, () => {
    otherMessage(`Server started on port ${PORT} @ http://localhost:${PORT}`);
  });
} catch (error) {
  errorMessage(`Error starting server: ${error}`);
}
