#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
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

export async function clean(workDir: string) {
  await fs.rm(path.join(workDir, 'dist'), { recursive: true, force: true });
}
