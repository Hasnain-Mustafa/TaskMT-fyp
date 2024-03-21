"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const user_1 = require("./user");
const project_1 = require("./project");
const task_1 = require("./task");
function createApolloGraphqlServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = new server_1.ApolloServer({
            typeDefs: `
            ${user_1.User.typeDefs}
            ${project_1.Project.typeDefs}
            ${task_1.Task.typeDefs}
            type Query {
                ${user_1.User.queries}
            }            type Mutation {
               ${user_1.User.mutations}
               ${project_1.Project.mutations}
               ${task_1.Task.mutations}
            }
           
            
        `,
            resolvers: {
                Query: Object.assign({}, user_1.User.resolvers.queries),
                Mutation: Object.assign(Object.assign(Object.assign({}, user_1.User.resolvers.mutations), project_1.Project.resolvers.mutations), task_1.Task.resolvers.mutations),
            },
        });
        yield server.start();
        return server;
    });
}
exports.default = createApolloGraphqlServer;
