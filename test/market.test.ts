import request from 'supertest';
import app from '../src/app';
import { sleep } from '../src/helpers/sleep';
import { assert } from 'chai';

const url = '/api/calcprice';
describe('GET market depth endpoint', () => {
  it('should return 200 OK', async () => {
    await sleep(4);
    return request(app)
      .get(url)
      .query({ pair: 'ETHUSD', operation: 'buy', amount: 100 })
      .expect(200);
  });
  it('should return an error with an invalid pair', () => {
    // await sleep(2);
    return request(app)
      .get(url)
      .query({ operation: 'buy', amount: 100 })
      .expect(412);
  });
  it('should return an error if the order is too big', () => {
    // await sleep(2);
    return request(app)
      .get(url)
      .query({ pair: 'BTCUSD', operation: 'buy', amount: 10000 })
      .expect(400);
  });
  it('should return an error if the price limit is not reachable', () => {
    return request(app)
      .get(url)
      .query({ pair: 'ETHUSD', operation: 'buy', amount: 10, priceLimit: 1 })
      .expect(400)
      .then((res) => {
        assert(
          res.body.message,
          'No order can be completed at that price limit'
        );
      });
  });
});
