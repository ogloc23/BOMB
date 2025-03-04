import { gql } from 'apollo-server-express';

export const userTypeDefs = gql`
  scalar DateTime  # ✅ Define DateTime scalar for timestamps

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    userName: String!
    email: String!
    balance: Float!
    role: String!  # ✅ Role can be "USER" or "ADMIN"
    createdAt: DateTime!
    updatedAt: DateTime!
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
    ): User!

    registerAdmin(
      firstName: String!
      lastName: String!
      userName: String!
      email: String!
      password: String!
    ): AuthPayload!  # ✅ Now includes firstName, lastName, and userName

    login(
      email: String!
      password: String!
    ): AuthPayload!

    requestPasswordReset(email: String!): MessageResponse!  
    resetPassword(token: String!, newPassword: String!): MessageResponse!  
  }
`;
