export const convertCurrency = (amount, from, to, currencies) => {
  if (from === to)
    return amount
  return currencies[from][to] * amount
}

const convertOddsToAmericanFormat = (decimalOdds, oddsType) => {
  switch(oddsType) {
    case 'moneyline':
      if(decimalOdds > 2.0) {
         return Math.floor(decimalOdds-1)*100
      }
      else {
        return Math.floor((-100)/(decimalOdds-1))
      }
  }
}

const floorFigure = (figure, decimals) => {
    if (!decimals) decimals = 3;
    var d = Math.pow(10,decimals);
    return (parseInt(figure*d)/d).toFixed(decimals);
}
export const convertOdds = (fromOdds, toOdds, oddsValue) => {
  switch(fromOdds) {
    case 'Decimal':
      if(toOdds === 'American') {
        return fromDecimalToAmerican(oddsValue)
      }
      return oddsValue
    case 'American':
      if(toOdds === 'Decimal')
        return americanToDecimal(oddsValue)
  }
}

const fromDecimalToAmerican = (decimalOdds) => {
  if(decimalOdds >= 2.0) 
    return Math.floor((decimalOdds-1)*(100))
  return Math.floor((-100)/(decimalOdds-1))

}

const americanToDecimal = (americanOdds) => {
  if(americanOdds > 0) 
    return floorFigure((americanOdds)/(100)+(1))
  return floorFigure((100)/(americanOdds/-1)+(1))

}

export const SPORTS = {
  1: {
    name: 'Soccer',
    icon: 'ionicons ion-ios-football'
  },
  3: {
    name: 'Basket',
    icon: 'ionicons ion-ios-basketball'
  },
  4: {
    name: 'Rugby',
    icon: 'ionicons ion-ios-americanfootball'
  },
  5: {
    name: 'Tennis',
    icon: 'ionicons ion-ios-tennisball'
  },
  6: {
    name: 'American football',
    icon: 'ionicons ion-ios-americanfootball'
  },
  7: {
    name: 'Baseball',
    icon: 'ionicons ion-ios-baseball'
  },
  8: {
    name: 'Handball',
    icon: 'ionicons ion-android-hand'
  }
}

export const displayOddsType = (id, output, condition, homeTeam, awayTeam) => {
  switch (id) {
    case ODDSTYPES.threeway:
      if (output === 'o1') return `1x2 (${homeTeam})`
      else if (output === 'o2') return '1x2 (Draw)'
      return `1x2 (${awayTeam})`
    case ODDSTYPES.totals:
      if (output === 'o1') return 'Over ' + condition.toFixed(2)
      return 'Under ' + condition.toFixed(2)
    case ODDSTYPES.moneyline:
      if (output === 'o1') return `${homeTeam} to win`
      return `${awayTeam} to win`
    case ODDSTYPES.dnb:
      if (output === 'o1') return `Draw no bet (${homeTeam})`
      return `Draw no bet (${awayTeam})`
    case ODDSTYPES.ahc:
      if (output === 'o1') {
        if (condition < 0) return 'Asian hcp ' + condition.toFixed(2) + ` (${homeTeam})`
        return 'Asian hcp +' + condition.toFixed(2) + ` (${homeTeam})`
      }
      if (condition < 0) return 'Asian hcp +' + condition.toFixed(2) * -1 + ` (${awayTeam})`
      return 'Asian hcp ' + condition.toFixed(2) * -1 + ` (${awayTeam})`
    case ODDSTYPES.points:
      if (output === 'o1') {
        if (condition < 0) return 'Handicap ' + condition.toFixed(2) + ` (${homeTeam})`
        return 'Handicap +' + condition.toFixed(2) + ` (${homeTeam})`
      }
      if (condition < 0) return 'Handicap +' + condition.toFixed(2) * -1 + ` (${awayTeam})`
      return 'Handicap ' + condition.toFixed(2) * -1 + ` (${awayTeam})`
    case ODDSTYPES.ehc:
      let resultString = ''
      if (condition >= 0) {
        resultString = '(' + condition + '-0)'
      } else {
        resultString = '(0' + condition + ')'
      }
      if (output === 'o1')
        return 'Euro hcp ' + resultString + ` (${homeTeam})`
      else return 'Euro hcp ' + resultString + ` (${awayTeam})`
    default:
      return 'N/A'
  }
}

export const ODDSTYPES = {
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
