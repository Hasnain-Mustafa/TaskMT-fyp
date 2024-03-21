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
const mutations = {
    createProject: (_, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Call the createProject function from userService.ts
            const res = yield (0, userService_1.createProject)(payload);
            return res.id;
        }
        catch (error) {
            // Handle any errors that occur during project creation
            console.error('Error creating project:', error);
            throw new Error('Failed to create project');
        }
    }),
    updateProject: userService_1.updateProject,
    deleteProject: userService_1.deleteProject,
    deleteProjectMember: userService_1.deleteProjectMember
};
exports.resolvers = { mutations };
