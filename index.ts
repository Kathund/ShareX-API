import { errorMessage, otherMessage, warnMessage } from './src/logger';
import { PORT, url, key, allowConfigGen } from './config.json';
import { loadEndpoints } from './src/functions';
import { existsSync, mkdirSync } from 'fs';
import fileUpload from 'express-fileupload';
import express, { Request, Response } from 'express';

if (!existsSync('./src/files')) {
  mkdirSync('./src/files');
}

const app = express();
try {
  (async () => {
    app.use(express.static('src/public'));
    app.set('views', './src/views');
    app.set('view engine', 'ejs');
    app.use(fileUpload());
    global.generateKey = allowConfigGen ? crypto.randomUUID() : null;
    const result = await loadEndpoints(app);
    if (result !== undefined) {
      otherMessage(`Loaded ${result} endpoints`);
    } else {
      otherMessage('No endpoints found');
    }

    app.get('/', async (req: Request, res: Response) => {
      try {
        return res.status(200).render('pages/index');
      } catch (err) {
        errorMessage(err as string);
        return res.status(500).send({ success: false, message: 'Internal server error' });
      }
    });

    app.listen(PORT, () => {
      otherMessage(`Server started on port ${PORT} @ http://localhost:${PORT}`);
      if (key === 'API_KEY') {
        warnMessage('The API Key is still the default key! It is recommended to change this in the config.json file.');
      }
      if (global.generateKey === null) return;
      otherMessage(`Config is available to be generated @ ${url}/generate?key=${global.generateKey}`);
      setTimeout(() => {
        if (global.generateKey === null) return;
        global.generateKey = null;
        otherMessage(`Config is no longer available to be generated. Please restart to generate a new key.`);
      }, 300000);
    });
  })();
} catch (error) {
  errorMessage(`Error starting server: ${error}`);
}
