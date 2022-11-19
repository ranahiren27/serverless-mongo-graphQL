import { ApolloServer } from "apollo-server-lambda";
import connectDB from "./db.js";
import typeDefs from "./attribute/schema.js";
import resolvers from "./attribute/resolvers.js";

connectDB();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
  }),
  playground: {
    endpoint: process.env.REACT_APP_GRAPHQL_ENDPOINT
      ? process.env.REACT_APP_GRAPHQL_ENDPOINT
      : "/production/graphql",
  },
});

export const graphqlHandler = server.createHandler({
  cors: {
    origin: "*",
  },
  port: 4000,
});
