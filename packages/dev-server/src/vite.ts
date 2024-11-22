import type { Plugin } from 'vite';
import { load } from 'cheerio';

export interface DevServerVitePluginOptions {
  port: number;
}

export const devServerVitePlugin = ({
  port,
}: DevServerVitePluginOptions): Plugin => ({
  name: '@react-appkit/dev-server',
  config(config) {
    config.define ??= {};
    config.define.__DEV_SERVER_PORT__ = JSON.stringify(port);

    config.build ??= {};
    config.build.rollupOptions ??= {};
    config.build.rollupOptions.input ??= {};
    (config.build.rollupOptions.input as Record<string, string>).dev =
      '@react-appkit/dev-server/loader';

    return config;
  },
  transformIndexHtml(html) {
    const $ = load(html);
    $('head').prepend('<script src="./dev.js"></script>',);
    return $.html() as string;
  },
});
