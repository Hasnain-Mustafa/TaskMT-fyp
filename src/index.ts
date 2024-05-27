import express from "express";
import createApolloGraphqlServer from "./graphql/index";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import cors from "cors";
import { decodeJWTToken } from "./services/userService";
import { startCronJobs } from "./services/cronJob";
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();

  app.use(bodyParser.json());
  app.use(cors());

  app.use(
    "/graphql",
    expressMiddleware(await createApolloGraphqlServer(), {
      context: async ({ req }) => {
        const token = req.headers["authorization"];
        try {
          if (token) {
            const user = decodeJWTToken(token);
            return { user };
          }
        } catch (error) {
          console.log(error);
        }
        return {}; // Return an empty object if no user is found or there's an error
      },
    })
  );
  startCronJobs();
  app.listen(PORT, "0.0.0.0", () =>
    console.log(`Server running on port ${PORT} `)
  );
}
startServer();