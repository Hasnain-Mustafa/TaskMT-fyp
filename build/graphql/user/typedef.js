"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `#graphql
    type User {
        id: ID!
        email:String!
        name: String!
        password: String!
        isManager: String!
        salt: String
    }
`;
