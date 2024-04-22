"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutations = void 0;
exports.mutations = `
  #graphql
  
    createProject(
      title: String,
      status: String,
      summary: String,
      weeks: String,
      budget: String,
      assigneeEmails: [String]
      creatorId: ID): Projects
      updateProject(
        projectId: ID!
        title: String
        status: String
        summary: String
        weeks: String,
        budget: String,
        assigneeEmails: [String]
      
      ): String
      
      deleteProject(
        projectId: ID!
      ): DeletedProject
      deleteProjectMember(
        projectId: ID!
        memberEmail: String!
      ): String


`;
