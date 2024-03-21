"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutations = void 0;
exports.mutations = `#graphql
    createProject(title:String, status:String, summary:String, type: String, priority: String, assignee: String, dueDate:DateTime ,startData: DateTime) :String
`;
