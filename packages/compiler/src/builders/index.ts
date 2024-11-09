#!/usr/bin/env node
import { buildMain } from './main';
import { buildRenderer } from './renderer';
import { buildPreload } from './preload';
import { buildResources } from './resources';

export async function buildAll(workDir: string) {
  await Promise.all([
    buildMain(workDir),
    buildRenderer(workDir),
    buildPreload(workDir),
    buildResources(workDir),
  ]);
}
