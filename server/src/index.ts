import express from 'express';
import createApolloGraphqlServer from './graphql/index';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';
import { decodeJWTToken } from './services/userService';

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();

  app.use(bodyParser.json());
  app.use(cors());

  app.use(
    '/graphql',
    expressMiddleware(await createApolloGraphqlServer(), {
      context: async ({ req }) => {
        const token = req.headers['authorization'];
        try {
          const user = decodeJWTToken(token as string);
          return { user };
        } catch (error) {
          console.log(error);
        }
      },
    })
  );
  app.listen(PORT, () => console.log(`Server running on port ${PORT} `));
}
startServer();
