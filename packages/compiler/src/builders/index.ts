#!/usr/bin/env node
import { mainBuilder } from './main';
import { rendererBuilder } from './renderer';
import { buildPreload } from './preload';
import { buildResources } from './resources';

export async function buildAllForProduction(workDir: string) {
  await Promise.all([
    mainBuilder(workDir).buildForProduction(),
    rendererBuilder(workDir).buildForProduction(),
    buildPreload(workDir),
    buildResources(workDir),
  ]);
}
