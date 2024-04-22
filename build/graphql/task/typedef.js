"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `
  #graphql
  
  type Task {
    id: ID!
    Title: String!
    Status: String!
    Summary: String!
    type: String!
    priority: String!
    dueDate: String!
    startDate: String!
    taskAssigneeId: String!
    projectId: String! 
  }
  type Tasks {
    id: ID!
    Title: String!
    Status: String!
    Summary: String!
    type: String!
    priority: String!
    dueDate: String!
    startDate: String!
    taskAssigneeId: String
    projectId: String! 
  }

  type User{
    id:ID!
    name: String!
    email: String!
  }
  type Project {
    id: ID!
    name: String!
    
  }
  type DeletedTask{
    id: ID!
  }
 

`;
