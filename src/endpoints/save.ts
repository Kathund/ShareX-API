import { Application, Request, Response } from 'express';
import { apiMessage, errorMessage } from '../logger';
import { UploadedFile } from 'express-fileupload';
import { url, key } from '../../config.json';
import { existsSync } from 'fs';
import { join } from 'path';

export default (app: Application) => {
  app.post('/save/:name', async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers['API-KEY'];
      if (apiKey !== key) {
        errorMessage('Invalid API key provided');
        return res.status(400).send({ sucsess: false, message: 'Invalid API key' });
      }
      apiMessage(req.path, 'User is trying to save a file');

      const file = req.files?.file as UploadedFile;
      if (!file) {
        errorMessage('No file provided for upload');
        return res.status(400).send({ sucsess: false, message: 'No file provided' });
      }

      const fileName = req.params.name;
      const fileNamePattern = /^[a-zA-Z0-9_-]+$/;
      if (!fileNamePattern.test(fileName)) {
        return res.status(400).json({ error: "Invalid file name" });
      }
      const filePath = join(__dirname, "../", "files", fileName);
      if (existsSync(filePath)) {
        errorMessage(`File ${fileName} already exists`);
        return res.status(400).json({ sucsess: false, message: `File ${fileName} already exists` });
      }

      await file.mv(filePath);

      apiMessage(req.path, `File ${fileName} saved successfully`);
      return res.status(200).json({
        sucsess: true,
        message: `File has been saved at ${url}/${fileName}`,
      });
    } catch (err) {
      errorMessage(err as string);
      return res.status(500).json({ sucsess: false, message: 'Internal server error' });
    }
  });
};
