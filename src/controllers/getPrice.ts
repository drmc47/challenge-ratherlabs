import { book } from '../app';
import { RequestHandler } from 'express';

export const getPrice: RequestHandler = async (req, res) => {
  // check ETHUSD o BTCUSD
  let { pair } = req.query;
  pair = pair.toString().toUpperCase();
  // ? Could be a middleware
  // if (pair !== 'ETHUSD' && pair !== 'BTCUSD') {
  //   return res.sendStatus(405);
  // }
  const betterBid = book[pair].bids[0];
  const betterAsk = book[pair].asks[0];

  res.send({ bestBid: betterBid, bestAsk: betterAsk });
};
