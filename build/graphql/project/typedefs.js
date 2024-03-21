"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `#graphql
    type Project {
        id: ID!
        title:String!
        status: String!
        summary: String!
        type: String!
        priority: String!
        assignee: String!
        dueDate: DateTime!
        startDate: DateTime!
    }
`;
