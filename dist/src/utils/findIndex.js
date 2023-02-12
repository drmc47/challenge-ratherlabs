"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function findIndexByProperty(order, pair, orderType, book) {
    for (let i = 0; i < book[pair][orderType].length; i++) {
        if (book[pair][orderType][i][0] === order[0]) {
            return i;
        }
    }
    return -1;
}
exports.default = findIndexByProperty;
//# sourceMappingURL=findIndex.js.map