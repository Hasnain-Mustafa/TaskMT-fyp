"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutations = void 0;
exports.mutations = `
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
