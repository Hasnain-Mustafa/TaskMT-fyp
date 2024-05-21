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
    turnedInAt: String
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
    taskCreatorId : String!
    turnedInAt: String
  }

  type Taskss {
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
    taskCreatorId : String!
    turnedInAt: String
    assigneeURL: Obj
  }
  type Obj {
    photoURL: String
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
