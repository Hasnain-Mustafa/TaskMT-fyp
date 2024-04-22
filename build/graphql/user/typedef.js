"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `#graphql
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
