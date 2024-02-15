import { Application, Request, Response } from 'express';
import { discordEmbed } from '../../config.json';
import { errorMessage } from '../logger';
import { readFileSync } from 'fs';

export default (app: Application) => {
  app.get('/discord', async (req: Request, res: Response) => {
    try {
      if (!discordEmbed || global.discordEmbedKey === null) {
        return res.status(400).send({ success: false, message: 'Discord Embeds are disabled' });
      }
      const discordKey = req.query.key;
      if (discordKey !== global.discordEmbedKey) {
        errorMessage('Invalid Embed Key provided');
        return res.status(400).send({ success: false, message: 'Invalid Embed Key provided' });
      }

      const data = JSON.parse(readFileSync('src/data/embed.json', 'utf-8'));
      return res.status(200).render('pages/discord', {
        data: data,
        embedKey: discordKey,
      });
    } catch (err) {
      errorMessage(err as string);
      return res.status(500).send({ success: false, message: 'Internal server error' });
    }
  });
};
