import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';

const app = express();
const server = createServer(app);

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
initSocket(server);

server.listen(port, async () => {
  try {
    console.log(`포트${port}가 열렸습니다`);

    const assets = await loadGameAssets();

    console.log(assets);
  } catch (err) {
    console.error('failed to load game assets:', err);
  }
});
