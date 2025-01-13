import typeDefs from './typeDefs.js';
import resolvers from './resolvers.js';

declare namespace Express {
  interface Request {
    user: {
      _id: unknown;
      username: string;
    };
  }
}


export { typeDefs, resolvers };