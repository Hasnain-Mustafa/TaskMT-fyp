"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queries = void 0;
exports.queries = `#graphql
    getAllProjectTasks(projectId:String!):[Task!]!
   getAssignedTasks(projectId:String!,taskAssigneeId:String!):[Task!]!
   getTaskAssigneeById(taskAssigneeId:String!):User
`;
