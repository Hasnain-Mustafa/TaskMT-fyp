"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutations = void 0;
exports.mutations = `#graphql
    signUpUser(email:String, name:String, password:String, isManager: Boolean, salt: String) :String
    generateUserToken(email:String!, password:String!):Token
    `;
