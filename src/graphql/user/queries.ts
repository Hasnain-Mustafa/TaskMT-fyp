export const queries = `#graphql
    getMemberById(userId: String!): User
    getUserByEmail(email: String!): User
    getCurrentLoggedInUser:User
    getNotifications(userId:String!): [Notification]
    getChats(userId:String!): [Chat]
    getGoals(userId:String!): [Goal]
`;
