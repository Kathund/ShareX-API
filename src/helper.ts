import { otherMessage, errorMessage } from './logger';
import { Application } from 'express';
import { readdirSync } from 'fs';

export const loadEndpoints = async (app: Application) => {
  try {
    const items = readdirSync('./src/endpoints');
    let loaded = 0;
    for (const item of items) {
      const endpoint = await import(`./endpoints/${item}`);
      endpoint.default(app);
      loaded++;
      otherMessage(`Loaded ${item.split('.')[0]} endpoint`);
    }
    return loaded;
  } catch (error) {
    errorMessage(`Error loading endpoints: ${error}`);
  }
};
