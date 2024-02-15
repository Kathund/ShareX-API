import { Application, Request, Response } from 'express';
import { apiMessage, errorMessage } from '../logger';
import { discordEmbed } from '../../config.json';
import { writeFileSync } from 'fs';

export default (app: Application) => {
  app.post('/embed', async (req: Request, res: Response) => {
    try {
      apiMessage(req.path, 'User is trying to save embed');
      if (!discordEmbed || global.discordEmbedKey === null) {
        return res.status(400).send({ success: false, message: 'Discord Embeds are disabled' });
      }
      const discordKey = req.query.key;
      if (discordKey !== global.discordEmbedKey) {
        errorMessage('Invalid Embed Key provided');
        return res.status(400).send({ success: false, message: 'Invalid Embed Key provided' });
      }
      const data = req.body;
      if (typeof data !== 'object') {
        errorMessage('User provided invalid data');
        return res.status(400).send({ success: false, message: 'Invalid data provided' });
      }
      if (
        !data.author ||
        !data.siteName ||
        !data.description ||
        !data.authorURL ||
        !data.siteNameURL ||
        !data.title ||
        !data.color
      ) {
        errorMessage('User provided invalid data');
        return res.status(400).send({ success: false, message: 'Invalid data provided' });
      }
      if (
        typeof data.author !== 'string' ||
        typeof data.siteName !== 'string' ||
        typeof data.description !== 'string' ||
        typeof data.authorURL !== 'string' ||
        typeof data.siteNameURL !== 'string' ||
        typeof data.title !== 'string' ||
        typeof data.color !== 'string' ||
        typeof data.timestampState !== 'boolean' ||
        typeof data.randomColorState !== 'boolean'
      ) {
        errorMessage('User provided invalid data');
        return res.status(400).send({ success: false, message: 'Invalid data provided' });
      }

      writeFileSync('src/data/embed.json', JSON.stringify(data));
      apiMessage(req.path, 'User updated embed data');
      return res.status(200).send({ success: true, message: 'Embed data saved' });
    } catch (err) {
      errorMessage(err as string);
      return res.status(500).send({ success: false, message: 'Internal server error' });
    }
  });
};
