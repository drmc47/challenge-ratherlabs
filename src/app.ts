import express from "express";
import Websocket from "ws";
import { BookInterface, Order } from "./types/sockets";
import findIndexByProperty from "./utils/findIndex";
import { getPrice } from "./controllers/getPrice";
import { effectivePrice } from "./controllers/effectivePrice";
import { checkPair } from "./middlewares/checkPair";
const app = express();
const ws = new Websocket("wss://api-pub.bitfinex.com/ws/2");
const pairs = {
  ETHUSD: "ETHUSD",
  BTCUSD: "BTCUSD",
};

const msg1 = JSON.stringify({
  event: "subscribe",
  channel: "book",
  symbol: "tBTCUSD",
});

const msg2 = JSON.stringify({
  event: "subscribe",
  channel: "book",
  symbol: "tETHUSD",
});

export const book: BookInterface = {
  BTCUSD: {
    bids: [],
    asks: [],
  },
  ETHUSD: {
    bids: [],
    asks: [],
  },
};
const chanId = { BTCUSD: 0, ETHUSD: 0 };

ws.onopen = () => {
  ws.send(msg1);
  ws.send(msg2);
};

// ws.onmessage = (msg) => checkMessage(msg, 'BTCUSD');
ws.onmessage = (msg) => {
  const data = JSON.parse(msg.data as string);
  // console.log(data);

  if (data.event) {
    if (data.event === "subscribed") {
      chanId[data.pair] = data.chanId;
    }
    //guardar el chanId, si data.pair === 'ETHUSD', chanIdETH = data.pair y lo mismo con BTC
    return;
  }
  const [channelId, orders] = data;
  const pair = chanId.BTCUSD === channelId ? pairs.BTCUSD : pairs.ETHUSD;
  if (orders.length > 3) {
    //this is the initial book
    book[pair].asks = orders.filter((order: Order) => order[2] < 0);
    book[pair].bids = orders.filter((order: Order) => order[2] > 0);
    return;
  } else {
    //this is an update
    // console.log(`actualizacion de ${pair}`, orders);
    const orderType = orders[2] > 0 ? "bids" : "asks";
    if (orders === "hb") return;
    const foundIdx = findIndexByProperty(orders, pair, orderType, book);
    if (foundIdx > -1) {
      //found the price
      if (orders[1] === 0) {
        //i have to delete the price
        // console.log('hay que eliminar el price', orders[0]);
        book[pair][orderType] = book[pair][orderType].filter((item: Order) => item[0] !== orders[0]);
        // console.log('eliminao');
      } else {
        // not 0, add to the book
        book[pair][orderType][foundIdx] = orders;
      }
      // console.log(
      //   `BOOK ${pair} ACTUALIZAO con nuevo ${orderType}`,
      //   book[pair][orderType]
      // );
    } else {
      book[pair][orderType].push(orders);
    }
    return;
  }
};

app.get("/", (_req, res) => {
  res.send("Hello!");
});

app.use(checkPair);

app.get("/price", getPrice);
app.get("/calcprice", effectivePrice);
app.get("/book", (req, res) => {
  const { pair } = req.query;

  return res.send(book[pair as string]);
});

app.listen(3000, () => console.log("holis el server ya ta andando"));
export default app;
