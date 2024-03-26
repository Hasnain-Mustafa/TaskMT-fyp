import {
  signUpTypes,
  signUpUser,
  UserTokenPayload,
  generateUserToken,
  getUserById,
} from '../../services/userService';

const queries = {
  
  getCurrentLoggedInUser: async (_: any, parameters: any, context: any) => {
    if (context && context.user) {
      const id = context.user.id;
      const user = await getUserById(id as string);
      console.log(user)
      return user;
    }
  }
  
};

const mutations = {
  signUpUser: async (_: any, payload: signUpTypes) => {
    const res = await signUpUser(payload);
    if (res) {
      return res.id;
    } else {
      throw new Error('Failed to create project');
    }
  },
  generateUserToken: async (_: any, payload: UserTokenPayload) => {
    const token = await generateUserToken(payload);
    return token;
  },
};

export const resolvers = { queries, mutations };
