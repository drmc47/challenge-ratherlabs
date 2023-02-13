# challenge-ratherlabs

# REST API application

Clone the repository

## Install

    yarn install

## Run the app

    yarn start

## Run the tests

    yarn test

# REST API

The API uses Bitfinex API to get the orderbook, it can handle ETHUSD and BTCUSD pairs. 


### Request

`GET /api/price/`

 Gives you the best price for bid-ask of the pair.

    Query params 
    pair: Must be ETHUSD or BTCUSD
    
`GET /api/calcprice/`
   
 Calculates the effective price for an order according to the orderbook. If the priceLimit is provided, retrieves the maximum order size that could be  executed for that price limit. 

    Query params 
    pair: Must be ETHUSD or BTCUSD
    operation: must be buy or sell
    amount: positive number
    (optional) priceLimit: must be a valid number



