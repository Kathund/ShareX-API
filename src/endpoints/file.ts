import { Application, Request, Response } from 'express';
import { apiMessage, errorMessage } from '../logger';
import { existsSync } from 'fs';
import { join } from 'path';

export default (app: Application) => {
  app.get('/:name', async (req: Request, res: Response) => {
    try {
      const fileName = req.params.name;
      apiMessage(req.path, `User is trying to get a file - ${fileName}`);
      const filePath = join(__dirname, '../', 'files', fileName);
      if (!existsSync(filePath)) {
        errorMessage(`File ${fileName} not found`);
        return res.status(404).send({ sucsess: false, message: `File ${fileName} not found` });
      }

      apiMessage(req.path, `File ${fileName} found`);
      return res.sendFile(filePath);
    } catch (err) {
      errorMessage(err as string);
      return res.status(500).send({ sucsess: false, message: 'Internal server error' });
    }
  });
};
