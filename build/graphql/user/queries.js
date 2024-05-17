"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queries = void 0;
exports.queries = `#graphql
    getMemberById(userId: String!): User
    getUserByEmail(email: String!): User
    getCurrentLoggedInUser:User
    getNotifications(userId:String!): [Notification]
    getChats(userId:String!): [Chat]
    getGoals(userId:String!): [Goal]
`;
