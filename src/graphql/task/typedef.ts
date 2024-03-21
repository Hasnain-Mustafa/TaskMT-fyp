export const typeDefs = `
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
