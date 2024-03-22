export const queries = `#graphql
    getAllProjects(creatorId:String!):[Projects!]!
    getAllProjectsAssigned(assigneeId: String!):[Projects!]!
`;
