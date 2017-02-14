export const leagueLookup = {
  8: "England: Premier League", // Premier league
  70: "England: Championship", // Championship,
  15: "England: League One", // League one,
  32: "England: League Two", // League two
  95: "England: League Cup", // League Cup
  93: "England: FA Cup", //FA Cup
  // Spain
  7: "Spain: La liga", // Primera divion
  138: "Spain: Copa Del Ray", // Copa del ray
  // Italy
  13: "Italy: Serie A", // Serie a,
  14: "Italy: Serie B", // Serie B
  // Netherlands
  1: "Netherlands: Eredivisie", // Eredivisie
  103: "Netherlands: Super Cup", // Cup
  // Germany
  9: "Germany: Bundesliga", // Bundesliga
  11: "Germany: 2. Bundesliga", // 2. Bundesliga
  104: "Germany: DFB Pokal", // Cup
  // France,
  16: "France: League 1", // League 1,
  17: "France: League 2", // League 2
  // Norway
  29: "Norway: Tippeligaen", // eliteserien
  36: "Norway: OBOS", // 1. div
  182: "Norway: Cup", // Cup
  // Sweden
  28: "Sweden: Allsvenskan", // Allsvenskan
  37: "Sweden: Superettan", // Superettan
  // Denmark
  30: "Denmark: Superliga", // Superliga
  181: "Denmark: Cup", // Cup
  // Brazil
  26: "Brazil: Serie A", // Serie A
  // Belgium
  24: "Belgium: Jupiler League", // Pro league
  126: "Belgium: Cup", // cup
  // Austria
  49: "Austria: Bundesliga", // Bundesliga
  // Argentina
  87: "Argentina: Primera Division", // Primera Division
  // Finland
  22: "Finland: Veikkausliiga", // Elite series
  // Greece
  107: "Greece: Super league", // Superleague
  // Poland
  120: "Poland: Ekstraklasa", // 1. Liga
  // Portugal
  63: "Portugal: Primeira liga", // Primeira liga
  640: "Portugal: Cup", // Cup
  // Russia
  121: "Russia: Premier League", // Premier League
  // Scotland
  43: "Scotland: Premier League", // Premier League,
  45: "Scotland: Championship", // Championship
  176: "Scotland: Cup", // Cup
  // Switzerland
  27: "Switzerland: Super league", // Super league
  // Turkey
  19: "Turkey: Super liga", // Super liga
  // USA
  33: "USA: MLS", // MLS
  // International
  10: "Champions League", // Champions League
  18: "Europa League", // Europa League
  385: "Africa Cup of Nations", // Africa Cup of nations

  // American Football
  500001: "NFL", // NFL

  // Baseball
  400001: "MLB", // MLB

  // Basket
  300013: "NBA", // NBA,
  224: "WC Qualifiers"
}

export const recommendedLeagues = Object.keys(leagueLookup).map(k => +k)
