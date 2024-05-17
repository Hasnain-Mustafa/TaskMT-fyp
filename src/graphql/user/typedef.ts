export const typeDefs = `#graphql
    type User {
        id: ID!
        email:String!
        name: String!
        isManager: String!
        photoURL:String
        salt: String
        assignedProjectIds: [String!] 
    }
    type Token {
        id: ID!
        email:String!
        name: String!
        isManager :String!
        userToken: String!
        photoURL:String
        assignedProjectIds: [String!] 
    }

    type Notification {
        id: ID
        image:String
        message: String
        desc :String
        time: String
        userId: ID
    }
    input NotificationInput {
        image: String!
        message: String!
        desc: String!
        time: String!
      }
      type Chat {
        id: ID
        image:String
        message: String
        sender: String
        desc :String
        time: String
        userId: ID
    }
    
    input ChatInput {
      userId: ID
        image: String!
        message: String!
        sender: String!
        desc: String!
        time: String!
      }
      type Goal {
        id: ID
        text: String
      isCompleted: Boolean
        userId: ID
    }
      input GoalInput {
        text: String!
       isCompleted: Boolean!
      }
      type DeletedGoal {
        id: ID!
        
      }
      type DeletedChat {
        userId: ID!
        
      }
      type  DeletedNotification {
        userId: ID!
        
      }
      
     
`;
