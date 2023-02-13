import { RequestHandler } from 'express';

export const checkEffective: RequestHandler = (req, res, next) => {
  let { operation } = req.query;
  const { amount } = req.query;
  if (!operation) {
    return res
      .status(412)
      .send({ message: 'You need to provide an operation type, sell or buy' });
  }

  if (!amount) {
    return res.status(412).send({ message: 'You need to provide an amount' });
  }
  operation = operation.toString().toLowerCase();
  if (operation !== 'buy' && operation !== 'sell') {
    return res
      .status(412)
      .send({ message: 'Invalid operation, must be sell or buy' });
  }
  if (+amount <= 0) {
    return res
      .status(412)
      .send({ message: 'Invalid amount, must be a positive number' });
  }
  next();
};
