export function getValueFromPorcentage(value, porcentage) {
  const parsedFloatValue = parseFloat(value);

  return Number(parsedFloatValue + (parseFloat(porcentage)/100 * parsedFloatValue)).toFixed(8);
}

export function getBTCAmountByCoinPrice(bitcoinAmount, coinPrice) {
  return Number(parseFloat(bitcoinAmount)/parseFloat(coinPrice)).toFixed(2);
}