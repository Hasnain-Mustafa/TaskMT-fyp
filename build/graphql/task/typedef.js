"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `
  #graphql
  
  type Task {
    id: ID!
    title: String!
    status: String!
    summary: String!
    type: String!
    priority: String!
    dueDate: String!
    startDate: String!
    taskAssignee: User!
    project: Project! 
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
`;
