import { url, key, allowConfigGen } from '../../config.json';
import { Application, Request, Response } from 'express';
import { apiMessage, errorMessage } from '../logger';

export default (app: Application) => {
  app.get('/generate', async (req: Request, res: Response) => {
    try {
      if (!allowConfigGen) return res.status(400).send({ success: false, message: 'Config generation is disabled' });
      if (global.generateKey === null) {
        return res.status(400).send({ success: false, message: 'You have already generated a config' });
      }
      const genKey = req.query.key;
      if (genKey !== global.generateKey) {
        errorMessage('Invalid Generate key provided');
        return res.status(400).send({ success: false, message: 'Invalid Generate key provided' });
      }
      apiMessage(req.path, 'User is generating a config file');
      apiMessage(req.path, `Config file has been generated`);
      global.generateKey = null;
      return res
        .status(200)
        .attachment(`ShareX-API-Config.sxcu`)
        .send({
          Version: '15.0.0',
          Name: 'ShareX-Uploader',
          DestinationType: 'ImageUploader, FileUploader',
          RequestMethod: 'POST',
          RequestURL: `${url}/save/{filename}`,
          Headers: {
            'api-key': key,
          },
          Body: 'MultipartFormData',
          FileFormName: 'file',
          URL: '{json:url}',
          DeletionURL: '{json:delete}',
          ErrorMessage: '{json:message}',
        });
    } catch (err) {
      errorMessage(err as string);
      return res.status(500).send({ success: false, message: 'Internal server error' });
    }
  });
};
