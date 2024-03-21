export const mutations = `
  #graphql
  
    createTask(
      title: String,
      status: String,
      summary: String,
      type: String,
      priority: String,
      dueDate: String,
      startDate: String,
      taskAssigneeEmail: String,
      projectId: ID): String
  
      updateTask(
        taskId: ID!
        title: String
        status: String
        summary: String
        type: String
        priority: String
        dueDate: String
        startDate: String
        taskAssigneeId: String
      
      ): String
      
      deleteTask(
        taskId: ID!
      ): String

`;
