import { rejects } from 'assert';
import exp from 'constants';
import { json } from 'express';
import fs from 'fs';
import path, { join, resolve } from 'path';
import { fileURLToPath } from 'url';

let gameAssets = {};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../public/assets');

const readFileAsync = (filemname) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filemname), 'utf-8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

export const loadGameAssets = async () => {
  try {
    const [stages, items, item_unlocks] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('item.json'),
      readFileAsync('item_unlock.json'),
    ]);

    gameAssets = { stages, items, item_unlocks };
    return gameAssets;
  } catch (err) {
    throw new Error('failed to load game assets' + err.message);
  }
};

export const getgameAssets = () => {
  return gameAssets;
};
