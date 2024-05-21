"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutations = void 0;
exports.mutations = `
  #graphql
  
    createProject(
      title: String,
      status: String,
      summary: String,
      weeks: Int,
      budget: Int,
      assigneeEmails: [String]
      creatorId: ID): Projectss

      updateProject(
        projectId: ID!
        title: String
    
        summary: String
        weeks: Int,
        budget: Int,
      
      
      ): Projectss
      
      deleteProject(
        projectId: ID!
      ): DeletedProject
      
      deleteProjects(
        projectIds: [ID!]!
        ): DeletedProjects!

      deleteProjectMember(
        projectId: ID!
        memberEmail: String!
      ): String


`;
