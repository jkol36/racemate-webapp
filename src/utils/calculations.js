import { convertCurrency } from './converters'
import { recommendedLeagues } from 'config'

export const calculateCurrentBalance = (trades, user, currencies) => {
  const { mainCurrency } = user
  let balance = user.bookmakers
    .reduce((prev, cur) => prev + convertCurrency(cur.amount, cur.currency, mainCurrency, currencies), 0)
  balance += getTotalProfit(trades, mainCurrency, currencies)
  return balance
}

export const calculateBetReturn = (wager, odds, status) => {
  switch(status) {
    case 1:
    case 3:
      return 0
    case 2:
      return wager * odds
    case 4:
      return wager
    case 5:
      return (wager * (odds + 1)) / 2
    case 6:
      return wager * 0.5
    default:
      throw new Error(`Can't calculate for status ${status}`)
  }
}

export const getTotalProfit = (trades, currency, currencies) =>
  trades.reduce((prev, t) => prev + convertCurrency(calculateBetReturn(t.wager, t.odds, t.status) - t.wager,
                                                    t.currency, currency, currencies), 0)

export const getFundGrowth = (trades, user, currencies) => {
  if (trades.length === 0)
    return 0
  const { mainCurrency } = user
  const startingBalance = getStartingBalance(user, mainCurrency, currencies)
  if (!startingBalance)
    return 0
  const totalProfit = getTotalProfit(trades, mainCurrency, currencies)
  return totalProfit / startingBalance * 100 || 0
}

export const getStartingBalance = (user, currency, currencies) =>
  user.bookmakers.reduce((prev, b) => prev + convertCurrency(b.amount, b.currency, currency, currencies), 0)

export const calculateStake = (kelly, kellyFrac, balance, mainCurrency, bookmakerCurrency, currencies) =>
  Math.round(kelly * kellyFrac * convertCurrency(balance, mainCurrency, bookmakerCurrency, currencies))
