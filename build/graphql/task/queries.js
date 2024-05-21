"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queries = void 0;
exports.queries = `#graphql
    getAllProjectTasks(projectId:String!):[Task!]!
   getAssignedTasks(projectId:String!,taskAssigneeId:String!):[Taskss!]!
   getCreatedTasks(projectId:String!,taskCreatorId:String!):[Taskss!]!
   getAssignedTasksById(taskAssigneeId:String!):[Tasks!]!
   getCreatedTasksById(taskCreatorId:String!):[Tasks!]!
   getAllAssignedTasksById(taskAssigneeId:String!):[Tasks!]!
   getAllCreatedTasksById(taskCreatorId:String!):[Tasks!]!
`;
