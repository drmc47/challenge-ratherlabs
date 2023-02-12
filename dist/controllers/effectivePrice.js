"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.effectivePrice = void 0;
/* eslint-disable prefer-const */
const app_1 = require("../app");
const effectivePrice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check ETHUSD o BTCUSD
    let { pair, operation, amount, priceLimit } = req.query;
    pair = pair.toString().toUpperCase();
    const result = getEffectivePrice(app_1.book, pair, operation, +amount, +priceLimit);
    if (!result.success) {
        return res.send(result.message).status(404);
    }
    return res.send(result.message);
});
exports.effectivePrice = effectivePrice;
const getEffectivePrice = (book, pair, operation, amount, priceLimit) => {
    let acum = 0;
    let price = 0;
    let bought = 0;
    const type = operation.toString() === "buy" ? "asks" : "bids";
    if (!book[pair][type].length) {
        return {
            success: false,
            message: "Book is not loaded yet, please try again later",
        };
    }
    for (let i = 0; i < book[pair][type].length; i++) {
        if (priceLimit) {
            if (type === "asks") {
                if (priceLimit <= book[pair][type][0][0]) {
                    return {
                        success: false,
                        message: "No order can be completed at that price limit",
                    };
                }
                //agregar verificacion si es compra price > priceLimit y si es venta price < priceLimit
                if (book[pair][type][i][0] > priceLimit) {
                    if (i === 0)
                        return;
                    // const aver = (priceLimit - price / acum) / book[pair][type][i][0];
                    // console.log('PRICE', price / acum);
                    // console.log('ACUM', acum);
                    // console.log('ACTUAL', book[pair][type][i][0]);
                    const max = (price - priceLimit * acum) / Math.abs(priceLimit - book[pair][type][i][0]);
                    console.log("cantidad que podes comprar", max);
                    return {
                        message: `You can ${operation} ${max} ${pair.slice(0, 3)} at $${priceLimit}`,
                        success: true,
                    };
                    //calcular cuanto puedo comprar antes de pasarse
                }
                //! NOT SURE IF CORRECT
            }
            else if (type === "bids") {
                //verificar para cuando el usuario quiere vender
                console.log(book[pair][type][0][0]);
                if (priceLimit >= book[pair][type][0][0]) {
                    return {
                        success: false,
                        message: "No order can be completed at that price limit",
                    };
                }
                if (book[pair][type][i][0] < priceLimit) {
                    if (i === 0)
                        return;
                    // const aver = (priceLimit - price / acum) / book[pair][type][i][0];
                    // console.log('PRICE', price / acum);
                    // console.log('ACUM', acum);
                    // console.log('ACTUAL', book[pair][type][i][0]);
                    console.log("xd", book[pair][type][i][0]);
                    const max = (price - priceLimit * acum) / (priceLimit - book[pair][type][i][0]);
                    console.log("cantidad que podes comprar", max);
                    return {
                        message: `You can ${operation} ${max} ${pair.slice(0, 3)} at $${priceLimit}`,
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
                message: `The effective price to ${operation} ${amount} of ${pair.slice(0, 3)} is $${price}`,
            };
        }
    }
    return {
        success: false,
        message: "This operation is too big to be completed!",
    };
};
//# sourceMappingURL=effectivePrice.js.map