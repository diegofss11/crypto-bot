import { get, post } from './fetch-utils';

const baseUrl = 'http://13.57.204.17:3000';

export const getExchanges = () =>  [ 'Binance' ];

export const getCoins = (exchange) => get(`${baseUrl}/coin?exchange=${exchange}`)

export const getCoinPrice = (exchange, coin) => get(`${baseUrl}/price?exchange=${exchange}&coinName=${coin}`)

export const getBitcoinBalance = () => 3;

export const submitOrder = data => post(`${baseUrl}/order`, data);


