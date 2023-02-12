"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable prefer-const */
const express_1 = __importDefault(require("express"));
const ws_1 = __importDefault(require("ws"));
const app = (0, express_1.default)();
const ws = new ws_1.default('wss://api-pub.bitfinex.com/ws/2');
const pairs = {
    ETHUSD: 'ETHUSD',
    BTCUSD: 'BTCUSD',
};
const msg1 = JSON.stringify({
    event: 'subscribe',
    channel: 'book',
    symbol: 'tBTCUSD',
});
const msg2 = JSON.stringify({
    event: 'subscribe',
    channel: 'book',
    symbol: 'tETHUSD',
});
let book = {
    BTCUSD: {
        bids: [],
        asks: [],
    },
    ETHUSD: {
        bids: [],
        asks: [],
    },
};
let chanId = { BTCUSD: 0, ETHUSD: 0 };
ws.onopen = () => {
    ws.send(msg1);
    ws.send(msg2);
};
// ws.onmessage = (msg) => checkMessage(msg, 'BTCUSD');
ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    // console.log(data);
    if (data.event) {
        if (data.event === 'subscribed') {
            chanId[data.pair] = data.chanId;
        }
        //guardar el chanId, si data.pair === 'ETHUSD', chanIdETH = data.pair y lo mismo con BTC
        return;
    }
    const [channelId, orders] = data;
    let pair = chanId.BTCUSD === channelId ? pairs.BTCUSD : pairs.ETHUSD;
    if (orders.length > 3) {
        //this is the initial book
        book[pair].asks = orders.filter((order) => order[2] < 0);
        book[pair].bids = orders.filter((order) => order[2] > 0);
        return;
    }
    else {
        //this is an update
        console.log(`actualizacion de ${pair}`, orders);
        let orderType = orders[2] > 0 ? 'bids' : 'asks';
        if (orders === 'hb')
            return;
        let foundIdx = findIndexByProperty(orders, pair, orderType);
        if (foundIdx > -1) {
            //found the price
            if (orders[1] === 0) {
                //i have to delete the price
                console.log('hay que eliminar el price', orders[0]);
                book[pair][orderType] = book[pair][orderType].filter((item) => item[0] !== orders[0]);
                console.log('eliminao');
            }
            else {
                // not 0, add to the book
                book[pair][orderType][foundIdx] = orders;
            }
            console.log(`BOOK ${pair} ACTUALIZAO con nuevo ${orderType}`, book[pair][orderType]);
        }
        else {
            book[pair][orderType].push(orders);
        }
        return;
    }
};
exports.default = app;
// The API should expose two endpoints:
// ○ One that receives a pair name, and retrieves the tips of the
// orderbook (i.e. the better prices for bid-ask). Response should
// include both the total amounts and prices.
// ○ Other endpoint that is called with the pair name, the operation
// type (buy/sell) and the amount to be traded. Should return the
// effective price that will result if the order is executed (i.e.
// evaluate Market Depth).
// ● API should return market values for the following pairs: BTC-USD and
// ETH-USD. We expect to handle unexpected pairs
// const checkUpdate = (order: Order) => {
//   const [price, count, amount] = order;
//   if (count > 0) {
//     if (amount > 0) {
//       let found = book.asks.find((order) => order[0] === price);
//       //si hay found, sumarle el count y el amount, sino pushear a book.bids el nuevo order
//       // ? quizas es mejor hacerlo con un forEach? (creo que no, pero tengo mucho sueño y por las dudas tiro la idea)
//       // ? ohhh quizas podría hacer otra funcion que reciba el price y el 'asks' o 'bids' como 'tipo', haga el book[tipo].find y devuelva el found
//     } else {
//       //amount < 0
//       let found = book.bids.find((order) => order[0] === price);
//       //si hay found, sumarle el count y el amount, sino pushear a book.bids el nuevo order
//     }
//   } else {
//     //count === 0 (nunca va a ser < 0 )
//   }
// };
app.get('/', (_req, res) => {
    res.send('hola juan calo');
});
app.listen(3000, () => console.log('holis el server ya ta andando'));
// ! Solucion a update or add en una array, ver !
// You will need a query function like the following to help you find indices according to a property in your database: (JSFiddle)
function findIndexByProperty(order, pair, orderType) {
    for (let i = 0; i < book[pair][orderType].length; i++) {
        if (book[pair][orderType][i][0] === order[0]) {
            return i;
        }
    }
    return -1;
}
// const foundPrice = (order: Order, pair: string, orderType) => {
//    let found = order.find((item) => item[0] === book[pair][orderType]);
//    let index = book[pair][orderType].findIndex(e => )
// };
// var johnIndex = findIndexByProperty(persons.data, 'name', 'John');
// if (johnIndex > -1) {
//     persons.data[johnIndex] = updatedJohn;
// } else {
//     persons.data.push(updatedJohn);
// }
//# sourceMappingURL=app.js.map