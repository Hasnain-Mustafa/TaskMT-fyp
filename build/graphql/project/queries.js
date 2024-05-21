"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queries = void 0;
exports.queries = `#graphql
    getAllProjects(creatorId:String!):[Projects!]!
    getAllProjectsAssigned(assigneeId: String!):[Projects!]!
    getProjectById(projectId: String!): Projects
`;
