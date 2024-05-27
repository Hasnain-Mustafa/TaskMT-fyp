import { typeDefs } from './typedef';
import { mutations } from './mutations';
import { queries } from './queries';
import { resolvers } from './resolvers';

export const Task = { queries,mutations,  resolvers, typeDefs };