export const typeDefs = `
  #graphql
  
  type Project {
    id: ID!
    title: String!
    status: String!
    summary: String!
    weeks: String!
    budget: String!
    assignees: User # Updated to User type
    creator: User! # Updated to User type
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }
`;
