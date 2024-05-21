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
      projectId: ID,
      taskCreatorId: ID
      turnedInAt: String
      ): Taskss
  
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
        turnedInAt: String
      
      ): Taskss
      
      deleteTask(
        taskId: ID!
      ): DeletedTask

`;
