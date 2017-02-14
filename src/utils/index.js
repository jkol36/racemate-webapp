import { RESTAPI_URL } from 'config'
import request from 'superagent'
import firebase from 'firebase'

export const tokenize = (request) =>
  new Promise((resolve, reject) => {
    firebase.auth().currentUser.getToken()
      .then(token => {
        request
          .set('token', token)
          .end((err, res) => {
            if (err) {
              if (res.body.message)
                err.stripeMessage = res.body.message
              reject(err)
            } else {
              resolve(res.body)
            }
          })
      })
  })


const STORAGE_KEY = '__trademate__storage__'

export const canUseLocalStorage = () => {
  const k = '__storage_test__'
  try {
    localStorage.setItem(k, k)
    localStorage.removeItem(k)
    return true
  } catch(e) {
    return false
  }
}

export const getFromStorage = (key) => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY + key))
  } catch(e) {
    return null
  }
}

export const writeToStorage = (key, value) => {
  try {
    localStorage.setItem(STORAGE_KEY + key, JSON.stringify(value))
    return true
  } catch(e) {
    return false
  }
}

export const appendToStorage = (key, value) => {
  const current = getFromStorage(key) || []
  current.push(value)
  return writeToStorage(key, current)
}


export const getStatusesForTrades = (trades, result) => trades.map(trade => ({
  id: trade.key,
  status: processBet(trade, result),
  result: result[getResultKey(trade.sport, trade.oddsType)],
  output: trade.output,
  oddsTypeCondition: trade.oddsTypeCondition,
  oddsType: trade.oddsType
  })
)

export function processBet(bet, result) {
  let score
  if (bet.sport === SPORTS.tennis) {
    if (bet.oddsType === ODDSTYPES.totals) {
      score = [result['TENNIS_GAMES']]
    } else if (bet.oddsType === ODDSTYPES.points) {
      score = result['TENNIS_GAMES']
    } else {
      score = result[getResultKey(bet.sport, bet.oddsType)]
    }
  } else {
    score = result[getResultKey(bet.sport, bet.oddsType)]
  }
  if (!score) {
    return null
  }
  return calculateStatus(bet, score)
}

export const STATUS = {
  open: 1,
  won: 2,
  lost: 3,
  void: 4,
  halfwon: 5,
  halflost: 6
}

const ODDSTYPES = {
  threeway: 0,
  moneyline: 1,
  points: 3,
  totals: 4,
  ahc: 5,
  totalsht: 65540,
  threewayht: 65536,
  dnb: 6291457,
  totalcorners: 9437188,
  totalcornersht: 9502724,
  ehc: 8388608
}

function getResultKey(sport, oddsType) {
  switch(sport) {
    case SPORTS.soccer:
      if (oddsType !== ODDSTYPES.moneyline)
        return 'FT'
      return 'CURRENT'
    case SPORTS.baseball:
      return 'R'
    case SPORTS.basket:
    case SPORTS.rugby:
    case SPORTS.tennis:
      return 'CURRENT'
    case SPORTS.handball:
      return 'FT'
    case SPORTS.americanfootball:
      return 'CURRENT'
    default:
      return null
  }
}

const SPORTS = {
  soccer: 1,
  basket: 3,
  rugby: 4,
  tennis: 5,
  americanfootball: 6,
  baseball: 7,
  handball: 8
}

const calculateStatus = (bet, score) => {
  switch(bet.oddsType) {
    case ODDSTYPES.threeway:
      switch(bet.output) {
        case 'o1': return score[0] > score[1] ? STATUS.won : STATUS.lost
        case 'o2': return score[0] === score[1] ? STATUS.won : STATUS.lost
        case 'o3': return score[0] < score[1] ? STATUS.won : STATUS.lost
        default:
          throw new Error('Cant calculate oddstype threeway odds')
      }
    case ODDSTYPES.moneyline:
    case ODDSTYPES.dnb:
    case ODDSTYPES.ahc:
    case ODDSTYPES.points:
      if (bet.oddsTypeCondition % 0.25 === 0 && bet.oddsTypeCondition % 0.5 !== 0) {
        let status = [
          calculateStatus({
            ...bet,
            oddsTypeCondition: bet.oddsTypeCondition + 0.25
          }, score),
          calculateStatus({
            ...bet,
            oddsTypeCondition: bet.oddsTypeCondition - 0.25
          }, score)
        ]
        if (status[0] === status[1]) return status[0]
        return status[0] + status[1] - 1
      }
      score = [score[0] + (bet.oddsTypeCondition || 0), score[1]]
      if (score[0] === score[1]) return STATUS.void
      switch(bet.output) {
        case 'o1':
          return score[0] > score[1] ? STATUS.won : STATUS.lost
        case 'o2':
          return score[1] > score[0] ? STATUS.won : STATUS.lost
        default:
          throw new Error('Cant calculate status')
      }
    case ODDSTYPES.totals:
      if (bet.oddsTypeCondition % 0.25 === 0 && bet.oddsTypeCondition % 0.5 !== 0) {
        let status = [
          calculateStatus({
            ...bet,
            oddsTypeCondition: bet.oddsTypeCondition + 0.25
          }, score),
          calculateStatus({
            ...bet,
            oddsTypeCondition: bet.oddsTypeCondition - 0.25
          }, score)
        ]
        if (status[0] === status[1]) return status[0]
        return status[0] + status[1] - 1
      }
      var sumScore = score[0] + score[1]
      if (sumScore === bet.oddsTypeCondition)
        return STATUS.void
      if (bet.output === 'o1')
        return sumScore > bet.oddsTypeCondition ? STATUS.won : STATUS.lost
      return sumScore < bet.oddsTypeCondition ? STATUS.won : STATUS.lost
      score = [score[0] + bet.oddsTypeCondition, score[1]]
      switch(bet.output) {
        case 'o1':
          return score[0] > score[1] ? STATUS.won : STATUS.lost
        case 'o3':
          return score[1] > score[0] ? STATUS.won : STATUS.lost
        case 'o2':
          return score[0] === score[1] ? STATUS.won : STATUS.lost
        default:
          throw new Error('Cant calculate status')
      }
  }
}
