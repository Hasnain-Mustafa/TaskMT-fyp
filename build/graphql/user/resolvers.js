"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const db_1 = require("../../lib/db");
const userService_1 = require("../../services/userService");
const queries = {
    getCurrentLoggedInUser: (_, parameters, context) => __awaiter(void 0, void 0, void 0, function* () {
        if (context && context.user) {
            const id = context.user.id;
            const user = yield (0, userService_1.getUserById)(id);
            return user;
        }
    }),
    getNotifications: (_, { userId }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Call your data source/service to fetch the user by ID
            const userNotifications = yield (0, userService_1.getNotifications)({ userId });
            return userNotifications;
        }
        catch (error) {
            // Handle errors
            throw new Error("Failed to fetch user notifications");
        }
    }),
    getChats: (_, { userId }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Call your data source/service to fetch the user by ID
            const userChats = yield (0, userService_1.getChats)({ userId });
            return userChats;
        }
        catch (error) {
            // Handle errors
            throw new Error("Failed to fetch user chats");
        }
    }),
    getUserByEmail: (_, { email }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Call your data source/service to fetch the user by ID
            const user = yield (0, userService_1.getUserByEmail)(email);
            return user;
        }
        catch (error) {
            // Handle errors
            throw new Error("Failed to fetch user ");
        }
    }),
    getGoals: (_, { userId }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Call your data source/service to fetch the user by ID
            const userGoals = yield (0, userService_1.getGoals)({ userId });
            return userGoals;
        }
        catch (error) {
            // Handle errors
            throw new Error("Failed to fetch user goals");
        }
    }),
    getMemberById: (_, { userId }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Call your data source/service to fetch the user by ID
            const user = yield (0, userService_1.getMemberById)({ userId });
            return user;
        }
        catch (error) {
            // Handle errors
            throw new Error("Failed to fetch user");
        }
    }),
};
const mutations = {
    signUpUser: (_, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, userService_1.signUpUser)(payload);
        if (res) {
            return res.id;
        }
        else {
            throw new Error("Failed to create project");
        }
    }),
    generateUserToken: (_, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield (0, userService_1.generateUserToken)(payload);
        return token;
    }),
    addNotifications: (_, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, userService_1.addNotifications)(payload);
        return result;
    }),
    addChats: (_, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, userService_1.addChats)(payload);
        return result;
    }),
    addGoals: (_, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, userService_1.addGoals)(payload);
        return result;
    }),
    signUpWithOAuth: (_, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, userService_1.signUpWithOAuth)(payload);
        if (res) {
            return res.id;
        }
        else {
            throw new Error("Failed to create user");
        }
    }),
    generateOAuthToken: (_, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield (0, userService_1.generateOAuthToken)(payload);
        return token;
    }),
    updateProfilePicture: (_, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedUser = yield (0, userService_1.updateProfilePicture)(payload);
        return updatedUser;
    }),
    subscribe: (_, { email }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Check if the email already exists
            const existingSubscriber = yield db_1.prismaClient.subscriber.findUnique({
                where: { email },
            });
            if (existingSubscriber) {
                return { success: false, message: "Email already subscribed." };
            }
            // Save new subscriber
            yield db_1.prismaClient.subscriber.create({
                data: {
                    email,
                },
            });
            return { success: true, message: "You've been subscribed successfully!" };
        }
        catch (error) {
            console.error("Subscription error:", error);
            return { success: false, message: "Failed to subscribe." };
        }
    }),
    requestPasswordReset: (_, { email }) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, userService_1.requestPasswordReset)({ email });
        return result;
    }),
    resetPassword: (_, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, userService_1.resetPassword)(payload);
        return result;
    }),
    deleteGoals: userService_1.deleteGoals,
    updateGoals: userService_1.updateGoals,
    deleteChats: userService_1.deleteChats,
    deleteNotifications: userService_1.deleteNotifications,
};
exports.resolvers = { queries, mutations };
