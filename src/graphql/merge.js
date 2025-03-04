import { BettingCurrencyResolvers } from './resolvers.js/BettingCurrency.js';
import { userResolvers } from './resolvers.js/User.js';
import { balanceResolvers } from './resolvers.js/Balance.js';

import { BettingCurrencyTypeDefs } from './schemas.js/BettingCurrency.js';
import { userTypeDefs } from './schemas.js/User.js';
import { balanceTypeDefs } from './schemas.js/Balance.js';


// Combine resolvers
const resolvers = [
  userResolvers,
  BettingCurrencyResolvers,
  balanceResolvers,

];

// Combine type definitions
const typeDefs = [
  userTypeDefs,
  BettingCurrencyTypeDefs,
  balanceTypeDefs,
];

export { resolvers, typeDefs };
