/* eslint-disable prefer-const */
import { RequestHandler } from 'express';
import { BookInterface, Order } from '../types/sockets';
import { book } from '../utils/handleMessage';

export const effectivePrice: RequestHandler = (req, res) => {
  // check ETHUSD o BTCUSD
  let { pair, operation, amount, priceLimit } = req.query;
  pair = pair.toString().toUpperCase();
  operation = operation.toString().toLowerCase();
  const result = getEffectivePrice(book, pair, operation, +amount, +priceLimit);
  if (!result.success) {
    return res.status(result.code).send({ message: result.message });
  }
  return res.send({ message: result.message });
};

const getEffectivePrice = (
  book: BookInterface,
  pair: string,
  operation: string,
  amount: number,
  priceLimit: number
) => {
  let acum = 0;
  let price = 0;
  let bought = 0;
  const type = operation === 'buy' ? 'asks' : 'bids';
  let priceCond = 0;

  if (!book[pair][type].length) {
    return {
      success: false,
      message: 'Book is not loaded yet, please try again later',
      code: 425,
    };
  }
  operation === 'buy'
    ? book[pair][type].sort((a: Order, b: Order) => a[0] - b[0])
    : book[pair][type].sort((a: Order, b: Order) => b[0] - a[0]);
  for (let i = 0; i < book[pair][type].length; i++) {
    if (priceLimit) {
      if (operation === 'buy') {
        //if the user gives a limit for a price lower than the lower asks
        if (book[pair][type][0][0] >= priceLimit) {
          return {
            success: false,
            message: 'No order can be completed at that price limit',
            code: 400,
          };
        }

        if (book[pair][type][i][0] >= priceLimit) {
          //if the price is higher than the price limit this means the average will go up

          // console.log('PRICE', price / acum);
          // console.log('ACUM (cantidad comprada)', acum);
          // console.log('ACTUAL', book[pair][type][i][0]);

          //price condition is checking if the user buys all the available amount at this level, will the priceLimit be exceeded, if not you can continue
          priceCond =
            (price +
              Math.abs(book[pair][type][i][2]) * book[pair][type][i][0]) /
            (acum + Math.abs(book[pair][type][i][2]));
          console.log('PRICE COND', priceCond);
          if (priceCond > priceLimit) {
            const max =
              (price - priceLimit * acum) /
              (priceLimit - book[pair][type][i][0]);

            console.log('cantidad que podes comprar', max);
            return {
              message: `You can ${operation} ${max} ${pair.slice(
                0,
                3
              )} at $${priceLimit}`,
              success: true,
            };
          }
        }
      } else if (type === 'bids') {
        //same as before, if the user wants to sell higher than the highest bid
        if (priceLimit >= book[pair][type][0][0]) {
          return {
            success: false,
            message: 'No order can be completed at that price limit',
            code: 400,
          };
        }
        //again, if the price is lower than the limit it means the avg price will go down
        if (book[pair][type][i][0] <= priceLimit) {
          priceCond =
            (price + book[pair][type][i][2] * book[pair][type][i][0]) /
            (acum + book[pair][type][i][2]);

          //if the user sells all the avalaible amount and the result is lower than the priceLimit it means the sell limit is in this level price
          if (priceCond < priceLimit) {
            const max =
              (price - priceLimit * acum) /
              (priceLimit - book[pair][type][i][0]);

            return {
              message: `You can ${operation} ${max} ${pair.slice(
                0,
                3
              )} at $${priceLimit}`,
              success: true,
            };
          }
        }
      }
    }
    acum += Math.abs(book[pair][type][i][2]);
    price += book[pair][type][i][0] * Math.abs(book[pair][type][i][2]);
    bought = amount - acum;

    if (acum >= amount) {
      price = price - Math.abs(bought) * book[pair][type][i][0];
      price = price / amount;
      //   if(price > priceLimit) {

      //   }
      //   console.log('bought', bought);

      return {
        success: true,
        message: `The effective price to ${operation} ${amount} of ${pair.slice(
          0,
          3
        )} is $${price}`,
      };
    }
  }
  return {
    success: false,
    message: 'This operation is too big to be completed!',
    code: 400,
  };
};
