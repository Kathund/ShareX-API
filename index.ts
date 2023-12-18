import { errorMessage, otherMessage } from './src/logger';
import { loadEndpoints } from './src/helper';
import fileUpload from 'express-fileupload';
import { existsSync, mkdirSync } from 'fs';
import { PORT } from './config.json';
import express from 'express';
import { join } from 'path';

const filesDir = join(__dirname, 'src', 'files');
if (!existsSync(filesDir)) {
  mkdirSync(filesDir);
}

const app = express();
try {
  app.use(fileUpload());
  const endpointsDir = join(__dirname, 'src', 'endpoints');
  const result = loadEndpoints(endpointsDir, app);
  if (result !== undefined) {
    otherMessage(`Loaded ${result.loaded} endpoints, skipped ${result.skipped} endpoints`);
  } else {
    otherMessage(`No endpoints found in ${endpointsDir}`);
  }
  app.listen(PORT, () => {
    otherMessage(`Server started on port ${PORT} @ http://localhost:${PORT}`);
  });
} catch (error) {
  errorMessage(`Error starting server: ${error}`);
}
