"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const typedef_1 = require("./typedef");
const mutations_1 = require("./mutations");
const resolvers_1 = require("./resolvers");
exports.Task = { mutations: mutations_1.mutations, resolvers: resolvers_1.resolvers, typeDefs: typedef_1.typeDefs };
