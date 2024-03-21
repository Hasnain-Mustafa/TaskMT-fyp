import { ApolloServer } from '@apollo/server';
import { User } from './user';
import { Project} from './project';
import { Task} from './task'
async function createApolloGraphqlServer() {
  const server = new ApolloServer({
    typeDefs: `
            ${User.typeDefs}
            ${Project.typeDefs}
            ${Task.typeDefs}
            type Query {
                ${User.queries}
            }            type Mutation {
               ${User.mutations}
               ${Project.mutations}
               ${Task.mutations}
            }
           
            
        `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
      },
      Mutation: {
        ...User.resolvers.mutations,
        ...Project.resolvers.mutations,
        ...Task.resolvers.mutations,
      },
    },
  });
  await server.start();
  return server;
}
export default createApolloGraphqlServer;
