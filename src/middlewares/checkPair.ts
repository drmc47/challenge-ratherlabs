import { RequestHandler } from 'express';

export const checkPair: RequestHandler = (req, res, next) => {
  const { pair } = req.query;
  if (
    pair.toString().toUpperCase() === 'BTCUSD' ||
    pair.toString().toUpperCase() === 'ETHUSD'
  ) {
    next();
  } else {
    return res
      .send({ message: 'Not a valid pair, choose between ETHUSD or BTCUSD' })
      .status(412);
  }
};
