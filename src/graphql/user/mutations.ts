export const mutations = `#graphql
    signUpUser(email:String, name:String, password:String, isManager: Boolean, salt: String, photoURL: String) :String
    generateUserToken(email:String!, password:String!):Token
    addNotifications(userId:ID!,notification:  [NotificationInput!]!):Notification
    addChats(chat:ChatInput!):Chat
    deleteChats(userId:ID!):DeletedChat
    deleteNotifications(userId:ID!):DeletedNotification
    addGoals(userId:ID!,goal:[GoalInput!]!):Goal
    deleteGoals(goalId:ID!):DeletedGoal
    updateGoals(goalId:ID!,isCompleted: Boolean!):Goal
    signUpWithOAuth(email:String, name:String,isManager: Boolean, photoURL:String) :String
    updateProfilePicture(email:String, photoURL: String):User
    generateOAuthToken(email:String!):Token
    subscribe(email: String!): SubscriptionResponse
    requestPasswordReset(email: String!): String!
    resetPassword(token: String!, newPassword: String!): String!
    `;
