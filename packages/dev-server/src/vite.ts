import type { Plugin } from 'vite';
import { load } from 'cheerio';

export interface DevServerVitePluginOptions {
  port: number;
  runtime: 'browser' | 'node';
}

export const devServerVitePlugin = ({
  port,
  runtime,
}: DevServerVitePluginOptions): Plugin => ({
  name: '@react-appkit/dev-server',
  config(config) {
    config.define ??= {};
    config.define.__DEV_SERVER_PORT__ = JSON.stringify(port);

    config.build ??= {};
    config.build.rollupOptions ??= {};
    config.build.rollupOptions.input ??= {};
    (config.build.rollupOptions.input as Record<string, string>).devServerLoader =
      '@react-appkit/dev-server/loader';

    return config;
  },
  banner(ctx) {
    if (runtime === 'browser') {
      return '';
    }

    return `require("./devServerLoader.js");\n`;
  },
  transformIndexHtml(html) {
    if (runtime === 'node') {
      return html;
    }

    const $ = load(html);
    $('head').prepend('<script src="./devServerLoader.js"></script>',);
    return $.html() as string;
  },
});
