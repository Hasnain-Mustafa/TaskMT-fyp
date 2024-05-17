export const queries = `#graphql
    getAllProjectTasks(projectId:String!):[Task!]!
   getAssignedTasks(projectId:String!,taskAssigneeId:String!):[Tasks!]!
   getCreatedTasks(projectId:String!,taskCreatorId:String!):[Tasks!]!
   getAssignedTasksById(taskAssigneeId:String!):[Tasks!]!
   getCreatedTasksById(taskCreatorId:String!):[Tasks!]!
   getAllAssignedTasksById(taskAssigneeId:String!):[Tasks!]!
   getAllCreatedTasksById(taskCreatorId:String!):[Tasks!]!
`;
