import { RequestHandler } from 'express';
import { Order } from '../types/sockets';
import { book } from '../utils/handleMessage';

export const getPrice: RequestHandler = (req, res) => {
  let { pair } = req.query;
  pair = pair.toString().toUpperCase();
  const betterBid: Order = book[pair].bids[0];
  const betterAsk: Order = book[pair].asks[0];

  res.send({
    success: true,
    message: {
      bestBid: {
        price: betterBid[0],
        amount: betterBid[2],
      },
      bestAsk: {
        price: betterAsk[0],
        amount: Math.abs(betterAsk[2]),
      },
    },
  });
};
