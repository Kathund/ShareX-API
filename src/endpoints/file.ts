import { getDate, getFileSize, getTime } from '../functions';
import { Application, Request, Response } from 'express';
import { apiMessage, errorMessage } from '../logger';
import { existsSync, mkdirSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
import { url } from '../../config.json';

export default (app: Application) => {
  app.get('/view/:name', async (req: Request, res: Response) => {
    try {
      const fileName = req.params.name;
      if (fileName === 'favicon.ico') return;
      apiMessage(req.path, `User is trying to get a file - ${fileName}`);
      const fileNamePattern = /^[a-zA-Z0-9]+\.(jpg|jpeg|png|mp4)$/;
      if (!fileNamePattern.test(fileName)) {
        return res.status(400).render('pages/badName');
      }
      const dir = resolve(dirname(''), 'src/files');
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      const filePath = resolve(dir, fileName);
      if (!existsSync(filePath)) {
        errorMessage(`File ${fileName} doesn't exists`);
        return res.status(400).render('pages/missingFile');
      }
      apiMessage(req.path, `File ${fileName} found`);
      const stats = statSync(filePath);
      return res.render('pages/file', {
        data: {
          name: fileName.split('.')[0],
          fileExtension: fileName.split('.')[1],
          timestamp: {
            raw: stats.birthtimeMs,
            unix: stats.birthtimeMs,
            utc: getTime(stats.birthtimeMs, 'UTC'),
          },
          size: getFileSize(stats.size),
        },
        img: `${url}/raw/${fileName}`,
        getTime: getTime,
        getDate: getDate,
      });
    } catch (err) {
      errorMessage(err as string);
      return res.status(500).send({ success: false, message: 'Internal server error' });
    }
  });
};
