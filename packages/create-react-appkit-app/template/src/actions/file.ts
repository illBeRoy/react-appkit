/**
 * Every file under the src/actions folder is contains async functions called "actions".
 * Actions have full access to the node environment and can be used to perform any task.
 * In order to use an action, simply import and call it.
 * Actions can be called from anywhere in your code, including windows.
 */
import fs from 'node:fs/promises';
import { showOpenDialog, showSaveDialog } from '@react-appkit/sdk/dialog';

export async function openTextFile() {
  const fileOpen = await showOpenDialog({ ext: ['txt'] });
  if (fileOpen.result === 'ok') {
    const file = fileOpen.paths[0];
    const content = await fs.readFile(file, 'utf-8');
    return content;
  } else {
    return null;
  }
}

export async function saveTextFile(text: string) {
  const selectedPath = await showSaveDialog({ ext: ['txt'] });
  if (selectedPath.result === 'ok') {
    const path = selectedPath.path;
    await fs.writeFile(path, text);
  }
}
