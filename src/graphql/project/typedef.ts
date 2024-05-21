export const typeDefs = `
  #graphql
  
  type Project {
    id: ID!
    title: String!
    status: String!
    summary: String!
    weeks: Int!
    budget: Int!
    assignees: User # Updated to User type
    creator: User! # Updated to User type
  }
  type Projects {
    id: ID!
    title: String!
    status: String!
    summary: String!
    weeks: Int!
    budget: Int!
    assigneeDetails: [User!]
    creatorId: String! 
  }
  type Projectss {
    id: ID!
    title: String!
    status: String!
    summary: String!
    weeks: Int!
    budget: Int!
    assigneeIds: [String!]
    creatorId: String! 
  }

  type DeletedProject {
    id: ID!
    
  }
  
  type DeletedProjects {
    ids: [ID!]!
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
    photoURL: String
  }
`;
