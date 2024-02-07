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

export const generateID = (length: number) => {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const getFileSize = (size: number) => {
  return {
    raw: size,
    dynamic:
      size < 1024
        ? size + ' B'
        : size < 1048576
          ? (size / 1024).toFixed(2) + ' KB'
          : (size / 1048576).toFixed(2) + ' MB',
  };
};

export const getDate = (timeStamp: number, timeZone?: string) => {
  const date = new Date(timeStamp);
  return date.toLocaleDateString('en-US', { timeZone: timeZone });
};

export const getTime = (timeStamp: number, timeZone?: string) => {
  const date = new Date(timeStamp);
  return date.toLocaleTimeString('en-US', { timeZone: timeZone });
};
