<p align="center"> :dollar: Crypto-bot </p>

## Application
Application link: https://cryptobotservice.herokuapp.com/

It consumes this open source API in https://github.com/diegogadens/order-bot

A crypto bot to execute sell and buy operations in the below exchanges
- Binance

## Fields information
- API Key - Information necessary to access your account. It will be saved on your localstorage if the order is submited correctly.
- Exchange - All the avaiable exchanges
- Coins - All the avaiable coins in a specific exchange

- BTC Amount - Amount of the coin to be purchased in BTC amount
  - 25%, 50%, 75%, 100% - Based on your BTC balance

- Stop Loss orders (*enabled only if stop loss is set*):
  - Market - it will be placed at the market price.
  - Limit - it will be placed at a specified price, or better, after a given stop price has been reached.

- Sell Target (%) - The specified price to place a MARKET order to sell.
- Stop Loss (%) - The specified price to place a MARKET/LIMIT order to sell.
