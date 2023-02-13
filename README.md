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

## Get list of Things

### Request

`GET /api/price/`

    Query params 
    pair: Must be ETHUSD or BTCUSD
    
`GET /api/calcprice/`

    Query params 
    pair: Must be ETHUSD or BTCUSD
    operation: must be buy or sell
    amount: positive number
    (optional) priceLimit: must be a valid number



