import { BookInterface, Order } from '../types/sockets';
import findIndexByProperty from './findIndex';

const chanId = { BTCUSD: 0, ETHUSD: 0 };

const pairs = {
  ETHUSD: 'ETHUSD',
  BTCUSD: 'BTCUSD',
};

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

export const handleMessage = (msg) => {
  {
    const data = JSON.parse(msg.data as string);
    // console.log(data);

    if (data.event) {
      if (data.event === 'subscribed') {
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
      const orderType = orders[2] > 0 ? 'bids' : 'asks';
      if (orders === 'hb') return;
      const foundIdx = findIndexByProperty(orders, pair, orderType, book);
      if (foundIdx > -1) {
        //found the price
        if (orders[1] === 0) {
          //i have to delete the price
          // console.log('hay que eliminar el price', orders[0]);
          book[pair][orderType] = book[pair][orderType].filter(
            (item: Order) => item[0] !== orders[0]
          );
        } else {
          // not 0, add to the book
          book[pair][orderType][foundIdx] = orders;
        }
      } else {
        book[pair][orderType].push(orders);
      }
      return;
    }
  }
};
