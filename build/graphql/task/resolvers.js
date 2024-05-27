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
exports.resolvers = void 0;
const userService_1 = require("../../services/userService");
const userService_2 = require("../../services/userService");
const queries = {
    getAllProjectTasks: (_, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield (0, userService_1.getAllProjectTasks)(payload);
            return res;
        }
        catch (error) {
            // Handle any errors that occur during project creation
            console.error("Error fetching created projects:", error);
            throw new Error("Failed to fetch project");
        }
    }),
    getAssignedTasks: (_, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield (0, userService_1.getAssignedTasks)(payload);
            return res;
        }
        catch (error) {
            console.error("Error fetching assigned tasks:", error);
            throw new Error("Failed to fetch tasks");
        }
    }),
    getCreatedTasks: (_, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield (0, userService_1.getCreatedTasks)(payload);
            return res;
        }
        catch (error) {
            console.error("Error fetching created tasks:", error);
            throw new Error("Failed to fetch tasks");
        }
    }),
    getAssignedTasksById: (_, { taskAssigneeId }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield (0, userService_1.getAssignedTasksById)({ taskAssigneeId });
            return res;
        }
        catch (error) {
            console.error("Error fetching assigned tasks:", error);
            throw new Error("Failed to fetch tasks");
        }
    }),
    getCreatedTasksById: (_, { taskCreatorId }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield (0, userService_1.getAllCreatedTasksById)({ taskCreatorId });
            return res;
        }
        catch (error) {
            console.error("Error fetching created tasks:", error);
            throw new Error("Failed to fetch tasks");
        }
    }),
    getAllAssignedTasksById: (_, { taskAssigneeId }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield (0, userService_1.getAllAssignedTasksById)({ taskAssigneeId });
            return res;
        }
        catch (error) {
            console.error("Error fetching assigned tasks:", error);
            throw new Error("Failed to fetch tasks");
        }
    }),
    getAllCreatedTasksById: (_, { taskCreatorId }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield (0, userService_1.getAllCreatedTasksById)({ taskCreatorId });
            return res;
        }
        catch (error) {
            console.error("Error fetching created tasks:", error);
            throw new Error("Failed to fetch tasks");
        }
    }),
};
const mutations = {
    createTask: (_, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Call the createTask function from userService.ts
            const res = yield (0, userService_2.createTask)(payload);
            return res;
        }
        catch (error) {
            throw new Error(`${error}`);
        }
    }),
    deleteTask: userService_2.deleteTask,
    updateTask: userService_2.updateTask,
};
exports.resolvers = { queries, mutations };