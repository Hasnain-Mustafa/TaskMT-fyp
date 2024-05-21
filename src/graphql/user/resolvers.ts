import { prismaClient } from '../../lib/db';
import {
  signUpTypes,
  signUpUser,
  UserTokenPayload,
  generateUserToken,
  getMemberById,
  addNotifications,
  NotificationPayload,
  getNotifications,
  getUserById,
  addGoals,
  GoalPayload,
  deleteGoals,
  deleteChats,
  getGoals,
  updateGoals,
  ChatPayload,
  addChats,
  getChats,
  getUserByEmail,
  deleteNotifications,
  signUpWithOAuthTypes,
  UpdatePicturePayload,
  signUpWithOAuth,
  generateOAuthToken,
  updateProfilePicture,
} from '../../services/userService';

const queries = {
  
  getCurrentLoggedInUser: async (_: any, parameters: any, context: any) => {
    if (context && context.user) {
      const id = context.user.id;
      const user = await getUserById(id as string);
      console.log(user)
      return user;
    }
  },
  getNotifications: async (_: any,  { userId }: { userId: string }) => {
    try {
     
      // Call your data source/service to fetch the user by ID
      const userNotifications= await getNotifications({userId});
      console.log(userNotifications)
      return userNotifications;
    } catch (error) {
      // Handle errors
      throw new Error('Failed to fetch user notifications');
    }
  },
  getChats: async (_: any,  { userId }: { userId: string }) => {
    try {
     
      // Call your data source/service to fetch the user by ID
      const userChats= await getChats({userId});
      console.log(userChats)
      return userChats;
    } catch (error) {
      // Handle errors
      throw new Error('Failed to fetch user chats');
    }
  },
  getUserByEmail: async (_: any,  { email}: { email: string }) => {
    try {
     
      // Call your data source/service to fetch the user by ID
      const user= await getUserByEmail(email);
      console.log(user)
      return user;
    } catch (error) {
      // Handle errors
      throw new Error('Failed to fetch user ');
    }
  },
  getGoals: async (_: any,  { userId }: { userId: string }) => {
    try {
     
      // Call your data source/service to fetch the user by ID
      const userGoals= await getGoals({userId});
      console.log(userGoals)
      return userGoals;
    } catch (error) {
      // Handle errors
      throw new Error('Failed to fetch user goals');
    }
  },
  getMemberById: async (_: any,  { userId }: { userId: string }) => {
    try {
     
      // Call your data source/service to fetch the user by ID
      const user= await getMemberById({userId});
      console.log(user)
      return user;
    } catch (error) {
      // Handle errors
      throw new Error('Failed to fetch user');
    }
  },
  
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
  addNotifications: async (_: any,  payload: NotificationPayload) => {
    const result = await addNotifications(payload);
    return result;
  },
  addChats: async (_: any,  payload: ChatPayload) => {
    const result = await addChats(payload);
    return result;
  },
  addGoals: async (_: any,  payload: GoalPayload) => {
    const result = await addGoals(payload);
    return result;
  }, signUpWithOAuth: async (_: any, payload: signUpWithOAuthTypes) => {
    const res = await signUpWithOAuth(payload);
    if (res) {
      return res.id;
    } else {
      throw new Error("Failed to create user");
    }
  },
  generateOAuthToken: async (_: any, payload: UserTokenPayload) => {
    const token = await generateOAuthToken(payload);
    return token;
  },
  updateProfilePicture: async (_: any, payload: UpdatePicturePayload) => {
    const updatedUser = await updateProfilePicture(payload);
    return updatedUser;
  },
  subscribe: async (_: any,  { email }: { email: string }) => {
    try {
      // Check if the email already exists
      const existingSubscriber = await prismaClient.subscriber.findUnique({
        where: { email },
      });
      if (existingSubscriber) {
        return { success: false, message: "Email already subscribed." };
      }

      // Save new subscriber
      await prismaClient.subscriber.create({
        data: {
          email,
        },
      });

      return { success: true, message: "You've been subscribed successfully!" };
    } catch (error) {
      console.error("Subscription error:", error);
      return { success: false, message: "Failed to subscribe." };
    }
  },

  

  deleteGoals,
  updateGoals,
  deleteChats,
  deleteNotifications

};

export const resolvers = { queries, mutations };
