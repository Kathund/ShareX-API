import { Application, Request, Response } from 'express';
import { apiMessage, errorMessage } from '../logger';
import { url, key, nameHide } from '../../config.json';
import { existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { generateID } from '../helper';

export default (app: Application) => {
  app.post('/save/:name', async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers['api-key'];
      if (apiKey !== key) {
        errorMessage('Invalid API key provided');
        return res.status(400).send({ success: false, message: 'Invalid API key' });
      }
      apiMessage(req.path, 'User is trying to save a file');
      const file = (req.files as any).file;
      if (!file) {
        errorMessage('No file provided for upload');
        return res.status(400).send({ success: false, message: 'No file provided' });
      }
      const fileName = nameHide ? `${generateID(10)}.${req.params.name.split('.')[1]}` : req.params.name;
      const fileNamePattern = /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/;
      if (!fileNamePattern.test(fileName)) {
        return res.status(400).json({ error: 'Invalid file name' });
      }
      const dir = resolve(dirname(''), 'src/files');
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      const filePath = resolve(dir, fileName);
      if (existsSync(filePath)) {
        errorMessage(`File ${fileName} already exists`);
        return res.status(400).json({ success: false, message: `File ${fileName} already exists` });
      }
      try {
        await file.mv(filePath);
      } catch (err) {
        errorMessage(`Error moving file: ${err}`);
        return res.status(500).json({ success: false, message: 'Error occurred while saving the file' });
      }
      apiMessage(req.path, `File ${fileName} has been saved`);
      return res
        .status(200)
        .json({
          success: true,
          message: `File has been saved at ${url}/${fileName}`,
          url: `${url}/${fileName}`,
          delete: `${url}/delete/${fileName}`,
        });
    } catch (err) {
      errorMessage(err as string);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
};
