import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./src/graphql/merge.js";
import { resolvers } from "./src/graphql/merge.js";
import jwt from "jsonwebtoken";
import User from "./src/models/User.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    let user = null;

    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      try {
        user = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }

    return { user, models: { User } }; // ✅ Removed Topic and Course
  },
});

// Start the server
const startServer = async () => {
  await connectDB();
  await server.start();
  server.applyMiddleware({ app });

  app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}${server.graphqlPath}`);
  });
};

// Start the application
startServer();
