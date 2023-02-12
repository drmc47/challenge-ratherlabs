import { RequestHandler } from 'express';

export const checkPair: RequestHandler = (req, res, next) => {
  const { pair } = req.query;

  if (!pair) {
    return res.status(412).send({ message: 'Pair argument missing' });
  }
  if (
    pair.toString().toUpperCase() === 'BTCUSD' ||
    pair.toString().toUpperCase() === 'ETHUSD'
  ) {
    next();
  } else {
    return res
      .status(412)
      .send({ message: 'Not a valid pair, choose between ETHUSD or BTCUSD' });
  }
};
