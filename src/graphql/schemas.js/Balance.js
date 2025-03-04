import { gql } from "apollo-server-express";

export const balanceTypeDefs = gql`
type Mutation {
    updateUserBalance(userId: ID!, amount: Float!, action: String!): User!
}
`;
