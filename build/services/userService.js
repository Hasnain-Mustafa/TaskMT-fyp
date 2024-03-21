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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getUserByEmail = exports.decodeJWTToken = exports.generateUserToken = exports.updateTask = exports.deleteTask = exports.createTask = exports.deleteProjectMember = exports.updateProject = exports.deleteProject = exports.createProject = exports.signUpUser = void 0;
const crypto_1 = require("crypto");
const db_1 = require("../lib/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined.');
}
const generateHash = (salt, password) => {
    const hashedPassword = (0, crypto_1.createHmac)('sha256', salt)
        .update(password)
        .digest('hex');
    return hashedPassword;
};
// User Signup
const signUpUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password, isManager } = payload;
    const salt = (0, crypto_1.randomBytes)(32).toString('hex');
    const hashedPassword = generateHash(salt, password);
    return db_1.prismaClient.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
            isManager,
            salt,
        },
    });
});
exports.signUpUser = signUpUser;
const createProject = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, status, summary, weeks, budget, assigneeEmails, creatorId } = payload;
        let allUsersFound = true;
        // Check if all users exist
        yield Promise.all(assigneeEmails.map((assigneeEmail) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield db_1.prismaClient.user.findUnique({
                where: { email: assigneeEmail }
            });
            if (!user) {
                console.error(`User with email ${assigneeEmail} not found.`);
                allUsersFound = false;
            }
        })));
        if (!allUsersFound) {
            throw new Error('Not all users were found. Project creation aborted.');
        }
        // Create the project
        const createdProject = yield db_1.prismaClient.project.create({
            data: {
                title,
                status,
                summary,
                weeks,
                budget,
                creator: { connect: { id: creatorId } }, // Connect the creator directly
                assignees: { connect: assigneeEmails.map(email => ({ email })) } // Connect assignees directly by email
            },
        });
        return createdProject;
    }
    catch (error) {
        console.error('Error creating project:', error);
        throw new Error('Failed to create project');
    }
});
exports.createProject = createProject;
const deleteProject = (_, { projectId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the project exists
        const existingProject = yield db_1.prismaClient.project.findUnique({
            where: { id: projectId }
        });
        if (!existingProject) {
            throw new Error(`Project with ID ${projectId} not found.`);
        }
        // Check if there are tasks associated with the project
        const tasksInProject = yield db_1.prismaClient.task.findMany({
            where: { projectId: projectId }
        });
        if (tasksInProject.length > 0) {
            // If tasks exist, delete them first
            yield Promise.all(tasksInProject.map((task) => __awaiter(void 0, void 0, void 0, function* () {
                yield db_1.prismaClient.task.delete({
                    where: { id: task.id }
                });
            })));
        }
        // Retrieve users with the project in assignedProjectIds
        const usersWithProject = yield db_1.prismaClient.user.findMany({
            where: { assignedProjectIds: { has: projectId } }
        });
        // Update each user document to remove the project from assignedProjectIds
        yield Promise.all(usersWithProject.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            yield db_1.prismaClient.user.update({
                where: { id: user.id },
                data: { assignedProjectIds: { set: user.assignedProjectIds.filter(id => id !== projectId) } }
            });
        })));
        // After deleting tasks and updating users, delete the project itself
        yield db_1.prismaClient.project.delete({
            where: { id: projectId }
        });
        return `Project with ID ${projectId} and associated tasks has been deleted successfully.`;
    }
    catch (error) {
        console.error('Error deleting project:', error);
        throw new Error('Failed to delete project');
    }
});
exports.deleteProject = deleteProject;
const updateProject = (_, _a) => __awaiter(void 0, void 0, void 0, function* () {
    var { projectId, assigneeEmails } = _a, updatedFields = __rest(_a, ["projectId", "assigneeEmails"]);
    try {
        // Check if the project exists
        const existingProject = yield db_1.prismaClient.project.findUnique({
            where: { id: projectId }
        });
        if (!existingProject) {
            throw new Error(`Project with ID ${projectId} not found.`);
        }
        // Fetch the project to verify assigneeEmails
        if (assigneeEmails && assigneeEmails.length > 0) {
            let allUsersFound = true;
            // Check if all users exist
            yield Promise.all(assigneeEmails.map((assigneeEmail) => __awaiter(void 0, void 0, void 0, function* () {
                const user = yield db_1.prismaClient.user.findUnique({
                    where: { email: assigneeEmail }
                });
                if (!user) {
                    console.error(`User with email ${assigneeEmail} not found.`);
                    allUsersFound = false;
                }
            })));
            if (!allUsersFound) {
                throw new Error('Not all users were found. Project updation aborted.');
            }
            // Update the project and connect the assignees
            yield db_1.prismaClient.project.update({
                where: { id: projectId },
                data: Object.assign(Object.assign({}, updatedFields), { assignees: { connect: assigneeEmails.map(email => ({ email })) } })
            });
        }
        else {
            // Update the project without updating the assignees
            yield db_1.prismaClient.project.update({
                where: { id: projectId },
                data: updatedFields
            });
        }
        return `Project with ID ${projectId} has been updated successfully.`;
    }
    catch (error) {
        console.error('Error updating project:', error);
        throw new Error('Failed to update project');
    }
});
exports.updateProject = updateProject;
const deleteProjectMember = (_, _b) => __awaiter(void 0, void 0, void 0, function* () {
    var { projectId, memberEmail, assigneeEmails } = _b, updatedFields = __rest(_b, ["projectId", "memberEmail", "assigneeEmails"]);
    try {
        // Check if the project exists
        const existingProject = yield db_1.prismaClient.project.findUnique({
            where: { id: projectId }
        });
        if (!existingProject) {
            throw new Error(`Project with ID ${projectId} not found.`);
        }
        // Remove the memberEmail from assigneeEmails if it's defined
        const updatedAssigneeEmails = assigneeEmails ? assigneeEmails.filter(email => email !== memberEmail) : [];
        // Update the project and connect the assignees
        yield db_1.prismaClient.project.update({
            where: { id: projectId },
            data: Object.assign(Object.assign({}, updatedFields), { assignees: { connect: updatedAssigneeEmails.map(email => ({ email })) } })
        });
        // Remove memberEmail from the project explicitly
        yield db_1.prismaClient.project.update({
            where: { id: projectId },
            data: {
                assignees: { disconnect: { email: memberEmail } }
            }
        });
        // Find the user corresponding to memberEmail to get the user ID
        const memberUser = yield db_1.prismaClient.user.findUnique({
            where: { email: memberEmail }
        });
        if (!memberUser) {
            console.error(`User with email ${memberEmail} not found.`);
            throw new Error(`User with email ${memberEmail} not found.`);
        }
        // Check if there are any tasks assigned to memberUser and delete them
        const tasksAssignedToMember = yield db_1.prismaClient.task.findMany({
            where: { taskAssigneeId: memberUser.id, projectId: projectId }
        });
        if (tasksAssignedToMember.length > 0) {
            yield Promise.all(tasksAssignedToMember.map((task) => __awaiter(void 0, void 0, void 0, function* () {
                yield db_1.prismaClient.task.delete({
                    where: { id: task.id }
                });
            })));
        }
        return `Member with email ${memberEmail} has been removed from the project with ID ${projectId}.`;
    }
    catch (error) {
        console.error('Error updating project:', error);
        throw new Error('Failed to update project');
    }
});
exports.deleteProjectMember = deleteProjectMember;
// async function getUsersAssignedToProject(projectId: string) {
//   const project = await prismaClient.project.findUnique({
//     where: {
//       id: projectId,
//     },
//     include: {
//       assignee: true,
//     },
//   });
//   if (!project) {
//     throw new Error(`Project with ID ${projectId} not found`);
//   }
//   return project.assigneeId;
// }
// // Example usage
// const projectId = '65fb3138632c90726363e59a';
// const usersAssignedToProject = await getUsersAssignedToProject(projectId);
// console.log(usersAssignedToProject);
// //     // Find the user based on the email
// const user = await prismaClient.user.findUnique({
//   where: {
//     email: assigneeEmail,
//   },
// });
// if (user){
// // Use the user's ID to find projects assigned to them
// const projectsAssignedToUser = await prismaClient.project.findMany({
//   where: {
//     assigneeId: user.id,
//   },
// });
// console.log(projectsAssignedToUser);
// }
// const projectsCreatedByUser = await prismaClient.project.findMany({
//   where: {
//     assigneeId: user.id,
//   },
// });
// console.log(projectsCreatedByUser);
const createTask = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, status, summary, type, priority, taskAssigneeEmail, projectId, dueDate, startDate } = payload;
        console.log(projectId);
        // Fetch the project to verify taskAssigneeEmail
        const project = yield db_1.prismaClient.project.findUnique({
            where: { id: projectId }
        });
        if (!project) {
            throw new Error(`Project with ID ${projectId} not found.`);
        }
        // Check if the task assignee is assigned to the project
        const taskAssignee = yield db_1.prismaClient.user.findUnique({
            where: { email: taskAssigneeEmail }
        });
        if (!taskAssignee) {
            throw new Error(`User with email ${taskAssigneeEmail} not found.`);
        }
        const assigneeExists = project.assigneeIds.includes(taskAssignee.id);
        if (!assigneeExists) {
            throw new Error(`User with email ${taskAssigneeEmail} is not assigned to the project.`);
        }
        // Create the task
        const createdTask = yield db_1.prismaClient.task.create({
            data: {
                title,
                status,
                summary,
                type,
                priority,
                dueDate,
                startDate,
                project: { connect: { id: projectId } },
                taskAssignee: { connect: { email: taskAssigneeEmail } } // Connect by user id
            }
        });
        return createdTask;
    }
    catch (error) {
        console.error('Error creating task:', error);
        throw new Error('Failed to create task');
    }
});
exports.createTask = createTask;
const deleteTask = (_, { taskId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the task exists
        const existingTask = yield db_1.prismaClient.task.findUnique({
            where: { id: taskId }
        });
        if (!existingTask) {
            throw new Error(`Task with ID ${taskId} not found.`);
        }
        // Delete the task
        yield db_1.prismaClient.task.delete({
            where: { id: taskId }
        });
        return `Task with ID ${taskId} has been deleted successfully.`;
    }
    catch (error) {
        console.error('Error deleting task:', error);
        throw new Error('Failed to delete task');
    }
});
exports.deleteTask = deleteTask;
const updateTask = (_, _c) => __awaiter(void 0, void 0, void 0, function* () {
    var { taskId, taskAssigneeId } = _c, updatedFields = __rest(_c, ["taskId", "taskAssigneeId"]);
    try {
        // Check if the task exists
        const existingTask = yield db_1.prismaClient.task.findUnique({
            where: { id: taskId }
        });
        if (!existingTask) {
            throw new Error(`Task with ID ${taskId} not found.`);
        }
        // Fetch the project to verify taskAssigneeEmail
        if (taskAssigneeId) {
            const projectId = existingTask.projectId;
            const project = yield db_1.prismaClient.project.findUnique({
                where: { id: projectId }
            });
            if (!project) {
                throw new Error(`Project with ID ${projectId} not found.`);
            }
            // Check if the task assignee is assigned to the project
            const assigneeExists = project.assigneeIds.includes(taskAssigneeId);
            if (!assigneeExists) {
                throw new Error(`User with ID ${taskAssigneeId} is not assigned to the project.`);
            }
            // Update the task
            yield db_1.prismaClient.task.update({
                where: { id: taskId },
                data: Object.assign(Object.assign({}, updatedFields), { taskAssignee: { connect: { id: taskAssigneeId } }, project: { connect: { id: projectId } } })
            });
        }
        else {
            // Update the task without updating the project or taskAssignee
            yield db_1.prismaClient.task.update({
                where: { id: taskId },
                data: updatedFields
            });
        }
        return `Task with ID ${taskId} has been updated successfully.`;
    }
    catch (error) {
        console.error('Error updating task:', error);
        throw new Error('Failed to update task');
    }
});
exports.updateTask = updateTask;
//Generating JWT Token for User
const generateUserToken = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = payload;
        const user = yield (0, exports.getUserByEmail)(email);
        if (!user) {
            throw new Error('User not found');
        }
        const userSalt = user.salt;
        const hashedPassword = generateHash(userSalt, password);
        if (hashedPassword !== user.password) {
            throw new Error('Invalid password');
        }
        // Generating Token with a longer expiration time (e.g., 1 hour)
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '1h',
        });
        return token;
    }
    catch (err) {
        // Handle errors
        throw new Error(`Error generating user token: ${err.message}`);
    }
});
exports.generateUserToken = generateUserToken;
const decodeJWTToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.decodeJWTToken = decodeJWTToken;
const getUserByEmail = (email) => {
    return db_1.prismaClient.user.findUnique({
        where: { email },
    });
};
exports.getUserByEmail = getUserByEmail;
const getUserById = (id) => {
    return db_1.prismaClient.user.findUnique({
        where: { id },
    });
};
exports.getUserById = getUserById;
