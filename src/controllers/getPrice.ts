import { book } from '../app';
import { RequestHandler } from 'express';

export const getPrice: RequestHandler = async (req, res) => {
  let { pair } = req.query;
  pair = pair.toString().toUpperCase();
  const betterBid = book[pair].bids[0];
  const betterAsk = book[pair].asks[0];

  res.send({ bestBid: betterBid, bestAsk: betterAsk });
};
