import { otherMessage, errorMessage } from './logger';
import { readdirSync, statSync } from 'fs';
import { Application } from 'express';
import { basename, join } from 'path';

export const loadEndpoints = (app: Application) => {
  try {
    const items = readdirSync('./src/endpoints');
    let loaded = 0;
    for (const item of items) {
      (async () => {
        const endpoint = await import(`./endpoints/${item}`);
        endpoint.default(app);
        loaded++;
        otherMessage(`Loaded ${item.split('.')[0]} endpoint`);
      })();
    }
    return { loaded };
  } catch (error) {
    errorMessage(`Error loading endpoints: ${error}`);
  }
};
