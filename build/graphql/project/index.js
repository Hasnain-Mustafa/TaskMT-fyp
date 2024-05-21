"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const typedef_1 = require("./typedef");
const mutations_1 = require("./mutations");
const queries_1 = require("./queries");
const resolvers_1 = require("./resolvers");
exports.Project = { mutations: mutations_1.mutations, queries: queries_1.queries, resolvers: resolvers_1.resolvers, typeDefs: typedef_1.typeDefs };