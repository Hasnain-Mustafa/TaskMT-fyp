export const queries = `#graphql
    getAllProjectTasks(projectId:String!):[Task!]!
   getAssignedTasks(projectId:String!,taskAssigneeId:String!):[Task!]!
`;
