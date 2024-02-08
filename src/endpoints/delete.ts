import { Application, Request, Response } from 'express';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { apiMessage, errorMessage } from '../logger';
import { key } from '../../config.json';
import { resolve, dirname } from 'path';

export default (app: Application) => {
  app.delete('/delete/:name', async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers['api-key'];
      if (apiKey !== key) {
        errorMessage('Invalid API key provided');
        return res.status(400).send({ success: false, message: 'Invalid API key' });
      }
      apiMessage(req.path, 'User is trying to delete a file');
      const fileName = req.params.name;
      const fileNamePattern = /^[a-zA-Z0-9]+\.(jpg|jpeg|png|mp4)$/;
      if (!fileNamePattern.test(fileName)) {
        return res
          .status(400)
          .json({
            error:
              'Invalid file name. Please only use English Alphabet characters, 0-9. .jpg .jpeg .png .mp4 are the only supported file types',
          });
      }
      const dir = resolve(dirname(''), 'src/files');
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      const filePath = resolve(dir, fileName);
      if (!existsSync(filePath)) {
        errorMessage(`File ${fileName} dose not exist`);
        return res.status(400).json({ success: false, message: `File ${fileName} dose not exist` });
      }
      try {
        unlinkSync(filePath);
      } catch (err) {
        errorMessage(`Error deleting file: ${err}`);
        return res.status(500).json({ success: false, message: 'Error occurred while deleing the file' });
      }
      apiMessage(req.path, `File ${fileName} has been deleted`);
      return res.status(200).json({ success: !0, message: 'File has deleted' });
    } catch (err) {
      errorMessage(err as string);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
};
