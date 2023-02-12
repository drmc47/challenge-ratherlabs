import express from 'express';
import Websocket from 'ws';
import { getPrice } from './controllers/getPrice';
import { effectivePrice } from './controllers/effectivePrice';
import { checkPair } from './middlewares/checkPair';
import { handleMessage } from './utils/handleMessage';

const app = express();
const ws = new Websocket('wss://api-pub.bitfinex.com/ws/2');

const msg1 = JSON.stringify({
  event: 'subscribe',
  channel: 'book',
  symbol: 'tBTCUSD',
});

const msg2 = JSON.stringify({
  event: 'subscribe',
  channel: 'book',
  symbol: 'tETHUSD',
});

ws.onopen = () => {
  ws.send(msg1);
  ws.send(msg2);
};

ws.onmessage = (msg) => handleMessage(msg);

app.use('/api', checkPair);

app.get('/', (_req, res) => {
  res.sendStatus(200);
});
app.get('/api/price', getPrice);
app.get('/api/calcprice', effectivePrice);

export default app;
