export const typeDefs = `#graphql
    type User {
        id: ID!
        email:String!
        name: String!
        isManager: String!
        salt: String
        assignedProjectIds: [String!] 
    }
    type Token {
        id: ID!
        email:String!
        name: String!
        isManager :String!
        userToken: String!
        assignedProjectIds: [String!] 
    }
   
`;
