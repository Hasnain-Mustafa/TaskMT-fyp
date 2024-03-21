export const mutations = `
  #graphql
  
    createProject(
      title: String,
      status: String,
      summary: String,
      weeks: String,
      budget: String,
      assigneeEmails: [String]
      creatorId: ID): String
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
      ): String
      deleteProjectMember(
        projectId: ID!
        memberEmail: String!
      ): String


`;
