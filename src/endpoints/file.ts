import { Application, Request, Response } from 'express';
import { apiMessage, errorMessage } from '../logger';
import { existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';

export default (app: Application) => {
  app.get('/:name', async (req: Request, res: Response) => {
    try {
      const fileName = req.params.name;
      apiMessage(req.path, `User is trying to get a file - ${fileName}`);
      const fileNamePattern = /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/;
      if (!fileNamePattern.test(fileName)) {
        return res.status(400).json({ error: 'Invalid file name' });
      }
      const dir = resolve(dirname(''), 'src/files');
      errorMessage(dir);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      const filePath = resolve(dir, fileName);
      if (!existsSync(filePath)) {
        errorMessage(`File ${fileName} dosent exists`);
        return res.status(400).json({ sucsess: false, message: `File ${fileName} dosent exist` });
      }
      apiMessage(req.path, `File ${fileName} found`);
      return res.sendFile(filePath);
    } catch (err) {
      errorMessage(err as string);
      return res.status(500).send({ sucsess: false, message: 'Internal server error' });
    }
  });
};
