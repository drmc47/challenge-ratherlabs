/* eslint-disable prefer-const */
import { book } from '../app';
import { RequestHandler } from 'express';
import { BookInterface } from '../types/sockets';

export const effectivePrice: RequestHandler = async (req, res) => {
  // check ETHUSD o BTCUSD
  let { pair, operation, amount, priceLimit } = req.query;
  pair = pair.toString().toUpperCase();
  const result = getEffectivePrice(
    book,
    pair,
    operation as string,
    +amount,
    +priceLimit
  );
  if (!result.success) {
    return res.send(result.message).status(404);
  }
  return res.send(result.message);
};

const getEffectivePrice = (
  book: BookInterface,
  pair: string,
  operation: string,
  amount: number,
  priceLimit
) => {
  let acum = 0;
  let price = 0;
  let bought = 0;
  const type = operation.toString() === 'buy' ? 'asks' : 'bids';
  if (!book[pair][type].length) {
    return {
      success: false,
      message: 'Book is not loaded yet, please try again later',
    };
  }

  for (let i = 0; i < book[pair][type].length; i++) {
    if (priceLimit) {
      if (type === 'asks') {
        if (priceLimit < book[pair][type][0][0]) {
          return {
            success: false,
            message: 'No order can be completed at that price limit',
          };
        }
        //agregar verificacion si es compra price > priceLimit y si es venta price < priceLimit
        if (book[pair][type][i][0] > priceLimit) {
          if (i === 0) return;
          // const aver = (priceLimit - price / acum) / book[pair][type][i][0];
          // console.log('PRICE', price / acum);
          // console.log('ACUM', acum);
          // console.log('ACTUAL', book[pair][type][i][0]);

          const max =
            (price - priceLimit * acum) / (priceLimit - book[pair][type][i][0]);

          console.log('cantidad que podes comprar', max);
          return {
            message: `You can ${operation} ${max} ${pair.slice(
              0,
              3
            )} at $${priceLimit}`,
            success: true,
          };

          //calcular cuanto puedo comprar antes de pasarse
        }
        //! NOT SURE IF CORRECT
      } else {
        //verificar para cuando el usuario quiere vender
        if (priceLimit > book[pair][type][0][0]) {
          return {
            success: false,
            message: 'No order can be completed at that price limit',
          };
        }

        if (book[pair][type][i][0] < priceLimit) {
          if (i === 0) return;
          // const aver = (priceLimit - price / acum) / book[pair][type][i][0];
          // console.log('PRICE', price / acum);
          // console.log('ACUM', acum);
          // console.log('ACTUAL', book[pair][type][i][0]);

          const max =
            (price - priceLimit * acum) / (priceLimit - book[pair][type][i][0]);

          console.log('cantidad que podes comprar', max);
          return {
            message: `You can ${operation} ${max} ${pair.slice(
              0,
              3
            )} at $${priceLimit}`,
            success: true,
          };

          //calcular cuanto puedo comprar antes de pasarse
        }
      }
    }
    acum += Math.abs(book[pair][type][i][2]);
    price += book[pair][type][i][0] * Math.abs(book[pair][type][i][2]);
    // console.log('promedio trucho', price / acum);

    bought = amount - acum;
    // console.log(book[pair][type][i][2]);
    // console.log(acum);

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
  };
};
