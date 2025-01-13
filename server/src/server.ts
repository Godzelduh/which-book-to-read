import express from 'express';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import http from 'http';
import db from './config/connection.js';
import typeDefs from './schema/typeDefs.js';
import resolvers from './schema/resolvers.js';
import { authenticateToken } from './services/auth.js';

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3001;

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      const user = authenticateToken(token, req, res);
      return { user };
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

db.once('open', () => {
  httpServer.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});