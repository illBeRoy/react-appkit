import { app } from 'electron';

export const env = async (key: string) => {
  return process.env[key];
};

export const quit = async () => {
  app.quit();
};
