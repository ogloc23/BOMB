import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    userName: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type MessageResponse {
    message: String!
  }

  type Query {
    getAllUsers: [User!]!
    getUserProfile(id: ID!): User
  }

  type Mutation {
    register(
      firstName: String!
      lastName: String!
      userName: String!
      email: String!
      password: String!
    ): User!  # ✅ Returns only the user

    login(
      email: String!
      password: String!
    ): AuthPayload!  # ✅ Returns token + user

    requestPasswordReset(email: String!): MessageResponse!  
    resetPassword(token: String!, newPassword: String!): MessageResponse!  
  }
`;
