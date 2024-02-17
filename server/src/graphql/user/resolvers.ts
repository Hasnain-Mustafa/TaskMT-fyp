import {
  signUpTypes,
  signUpUser,
  UserTokenPayload,
  generateUserToken,
  gertUserById,
} from '../../services/userService';

const queries = {
  generateUserToken: async (_: any, payload: UserTokenPayload) => {
    const token = await generateUserToken(payload);
    return token;
  },
  getCurrentLoggedInUser: async (_: any, parameters: any, context: any) => {
    if (context && context.user) {
      const id = context.user.id;
      const user = gertUserById(id as string);
      return user;
    }
  },
};

const mutations = {
  signUpUser: async (_: any, payload: signUpTypes) => {
    const res = await signUpUser(payload);
    return res.id;
  },
};

export const resolvers = { queries, mutations };
