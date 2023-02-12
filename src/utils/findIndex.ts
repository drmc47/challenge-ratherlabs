import { BookInterface, Order } from '../types/sockets';

function findIndexByProperty(
  order: Order,
  pair: string,
  orderType: string,
  book: BookInterface
) {
  for (let i = 0; i < book[pair][orderType].length; i++) {
    if (book[pair][orderType][i][0] === order[0]) {
      return i;
    }
  }
  return -1;
}

export default findIndexByProperty;
