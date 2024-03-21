"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queries = void 0;
exports.queries = `#graphql
    generateUserToken(email:String!, password:String!):String
    getCurrentLoggedInUser:User
`;
