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
exports.requestPasswordReset = exports.resetPassword = exports.updateProfilePicture = exports.generateOAuthToken = exports.signUpWithOAuth = exports.deleteNotifications = exports.deleteChats = exports.updateGoals = exports.deleteGoals = exports.addGoals = exports.getAllAssignedTasksById = exports.getAllCreatedTasksById = exports.getAssignedTasksById = exports.getCreatedTasksById = exports.getGoals = exports.getNotifications = exports.getChats = exports.getMemberById = exports.addChats = exports.addNotifications = exports.getAssignedTasks = exports.getCreatedTasks = exports.getAllProjectTasks = exports.getAllProjectsAssigned = exports.getProjectById = exports.getAllProjects = exports.getUserById = exports.getUserByEmail = exports.decodeJWTToken = exports.generateUserToken = exports.updateTask = exports.deleteTask = exports.createTask = exports.deleteProjectMember = exports.updateProject = exports.deleteProject = exports.deleteProjects = exports.createProject = exports.signUpUser = void 0;
const crypto_1 = require("crypto");
const db_1 = require("../lib/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailTransporter_1 = require("./emailTransporter");
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined.");
}
const generateHash = (salt, password) => {
    const hashedPassword = (0, crypto_1.createHmac)("sha256", salt)
        .update(password)
        .digest("hex");
    return hashedPassword;
};
// User Signup
const signUpUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password, isManager, photoURL } = payload;
    try {
        const user = yield (0, exports.getUserByEmail)(email);
        if (user) {
            throw new Error("User already exists!");
        }
        const salt = (0, crypto_1.randomBytes)(32).toString("hex");
        const hashedPassword = generateHash(salt, password);
        return db_1.prismaClient.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                isManager,
                salt,
                photoURL,
            },
        });
    }
    catch (err) {
        // Handle errors
        throw err;
    }
});
exports.signUpUser = signUpUser;
function isValidEmail(email) {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
}
const createProject = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, status, summary, weeks, budget, assigneeEmails, creatorId } = payload;
    let allUsersFound = true;
    let managerAssigned = false;
    let assigneeIds = []; // Store user IDs of assignees
    for (const email of assigneeEmails) {
        if (!isValidEmail(email)) {
            throw new Error(`Invalid email format: ${email}`);
        }
        const user = yield db_1.prismaClient.user.findUnique({
            where: { email },
        });
        if (!user) {
            allUsersFound = false;
            throw new Error(`User with email ${email} not found.`);
        }
        else if (user.isManager) {
            managerAssigned = true;
            throw new Error(`User with email ${email} is a manager and cannot be assigned to projects.`);
        }
        else {
            assigneeIds.push(user.id); // Collect user ID
        }
    }
    if (!allUsersFound) {
        throw new Error("One or more assignees not found.");
    }
    if (managerAssigned) {
        throw new Error("Project managers cannot be assigned to projects.");
    }
    // Create the project
    try {
        const createdProject = yield db_1.prismaClient.project.create({
            data: {
                title,
                status,
                summary,
                weeks,
                budget,
                creator: { connect: { id: creatorId } },
                assignees: {
                    connect: assigneeIds.map((id) => ({ id })), // Connect assignees by their IDs
                },
            },
        });
        return createdProject;
    }
    catch (err) {
        throw err;
    }
});
exports.createProject = createProject;
const deleteProjects = (_, { projectIds }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve all projects that match the array of projectIds
        const existingProjects = yield db_1.prismaClient.project.findMany({
            where: { id: { in: projectIds } },
        });
        // Map of existing project IDs for quick lookup
        const existingProjectIds = new Set(existingProjects.map((project) => project.id));
        // Filter out non-existent projects to avoid errors
        const validProjectIds = projectIds.filter((id) => existingProjectIds.has(id));
        if (validProjectIds.length === 0) {
            throw new Error("No valid project IDs found.");
        }
        // Retrieve all tasks associated with the valid projects
        const tasksInProjects = yield db_1.prismaClient.task.findMany({
            where: { projectId: { in: validProjectIds } },
        });
        // Delete all tasks associated with these projects
        if (tasksInProjects.length > 0) {
            yield Promise.all(tasksInProjects.map((task) => __awaiter(void 0, void 0, void 0, function* () {
                yield db_1.prismaClient.task.delete({
                    where: { id: task.id },
                });
            })));
        }
        // Retrieve users with any of the projects in assignedProjectIds
        const usersWithProjects = yield db_1.prismaClient.user.findMany({
            where: { assignedProjectIds: { hasSome: validProjectIds } },
        });
        // Update each user document to remove the projects from assignedProjectIds
        yield Promise.all(usersWithProjects.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            const updatedProjectIds = user.assignedProjectIds.filter((id) => !validProjectIds.includes(id));
            yield db_1.prismaClient.user.update({
                where: { id: user.id },
                data: { assignedProjectIds: { set: updatedProjectIds } },
            });
        })));
        // After tasks and users have been updated, delete the projects themselves
        yield Promise.all(validProjectIds.map((projectId) => __awaiter(void 0, void 0, void 0, function* () {
            yield db_1.prismaClient.project.delete({
                where: { id: projectId },
            });
        })));
        return { ids: validProjectIds }; // Return the IDs of deleted projects
    }
    catch (error) {
        console.error("Error deleting projects:", error);
        throw new Error("Failed to delete projects");
    }
});
exports.deleteProjects = deleteProjects;
const deleteProject = (_, { projectId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the project exists
        const existingProject = yield db_1.prismaClient.project.findUnique({
            where: { id: projectId },
        });
        if (!existingProject) {
            throw new Error(`Project with ID ${projectId} not found.`);
        }
        // Check if there are tasks associated with the project
        const tasksInProject = yield db_1.prismaClient.task.findMany({
            where: { projectId: projectId },
        });
        if (tasksInProject.length > 0) {
            // If tasks exist, delete them first
            yield Promise.all(tasksInProject.map((task) => __awaiter(void 0, void 0, void 0, function* () {
                yield db_1.prismaClient.task.delete({
                    where: { id: task.id },
                });
            })));
        }
        // Retrieve users with the project in assignedProjectIds
        const usersWithProject = yield db_1.prismaClient.user.findMany({
            where: { assignedProjectIds: { has: projectId } },
        });
        // Update each user document to remove the project from assignedProjectIds
        yield Promise.all(usersWithProject.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            yield db_1.prismaClient.user.update({
                where: { id: user.id },
                data: {
                    assignedProjectIds: {
                        set: user.assignedProjectIds.filter((id) => id !== projectId),
                    },
                },
            });
        })));
        // After deleting tasks and updating users, delete the project itself
        yield db_1.prismaClient.project.delete({
            where: { id: projectId },
        });
        return { id: projectId };
    }
    catch (error) {
        console.error("Error deleting project:", error);
        throw new Error("Failed to delete project");
    }
});
exports.deleteProject = deleteProject;
const updateProject = (_, _a) => __awaiter(void 0, void 0, void 0, function* () {
    var { projectId } = _a, updatedFields = __rest(_a, ["projectId"]);
    try {
        // Check if the project exists
        const existingProject = yield db_1.prismaClient.project.findUnique({
            where: { id: projectId },
        });
        if (!existingProject) {
            throw new Error(`Project with ID ${projectId} not found.`);
        }
        // Update the project without updating the assignees
        const project = yield db_1.prismaClient.project.update({
            where: { id: projectId },
            data: updatedFields,
        });
        return project;
    }
    catch (error) {
        console.error("Error updating project:", error);
        throw new Error("Failed to update project");
    }
});
exports.updateProject = updateProject;
const deleteProjectMember = (_, _b) => __awaiter(void 0, void 0, void 0, function* () {
    var { projectId, memberEmail, assigneeEmails } = _b, updatedFields = __rest(_b, ["projectId", "memberEmail", "assigneeEmails"]);
    try {
        // Check if the project exists
        const existingProject = yield db_1.prismaClient.project.findUnique({
            where: { id: projectId },
        });
        if (!existingProject) {
            throw new Error(`Project with ID ${projectId} not found.`);
        }
        // Remove the memberEmail from assigneeEmails if it's defined
        const updatedAssigneeEmails = assigneeEmails
            ? assigneeEmails.filter((email) => email !== memberEmail)
            : [];
        // Update the project and connect the assignees
        yield db_1.prismaClient.project.update({
            where: { id: projectId },
            data: Object.assign(Object.assign({}, updatedFields), { assignees: {
                    connect: updatedAssigneeEmails.map((email) => ({ email })),
                } }),
        });
        // Remove memberEmail from the project explicitly
        yield db_1.prismaClient.project.update({
            where: { id: projectId },
            data: {
                assignees: { disconnect: { email: memberEmail } },
            },
        });
        // Find the user corresponding to memberEmail to get the user ID
        const memberUser = yield db_1.prismaClient.user.findUnique({
            where: { email: memberEmail },
        });
        if (!memberUser) {
            console.error(`User with email ${memberEmail} not found.`);
            throw new Error(`User with email ${memberEmail} not found.`);
        }
        // Check if there are any tasks assigned to memberUser and delete them
        const tasksAssignedToMember = yield db_1.prismaClient.task.findMany({
            where: { taskAssigneeId: memberUser.id, projectId: projectId },
        });
        if (tasksAssignedToMember.length > 0) {
            yield Promise.all(tasksAssignedToMember.map((task) => __awaiter(void 0, void 0, void 0, function* () {
                yield db_1.prismaClient.task.delete({
                    where: { id: task.id },
                });
            })));
        }
        return `Member with email ${memberEmail} has been removed from the project with ID ${projectId}.`;
    }
    catch (error) {
        console.error("Error updating project:", error);
        throw new Error("Failed to update project");
    }
});
exports.deleteProjectMember = deleteProjectMember;
const createTask = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, status, summary, type, priority, taskAssigneeEmail, projectId, dueDate, startDate, taskCreatorId, turnedInAt, } = payload;
        // Validate that all required variables are present
        if (!title ||
            !status ||
            !summary ||
            !type ||
            !priority ||
            !taskAssigneeEmail ||
            !projectId ||
            !dueDate ||
            !startDate ||
            !taskCreatorId) {
            throw new Error("All fields are required.");
        }
        // Fetch the project to verify taskAssigneeEmail
        const project = yield db_1.prismaClient.project.findUnique({
            where: { id: projectId },
        });
        if (!project) {
            throw new Error(`Project with ID ${projectId} not found.`);
        }
        // Check if the task assignee is assigned to the project
        const taskAssignee = yield db_1.prismaClient.user.findUnique({
            where: { email: taskAssigneeEmail },
        });
        if (!taskAssignee) {
            throw new Error(`User with email ${taskAssigneeEmail} not found.`);
        }
        const assigneeExists = project.assigneeIds.includes(taskAssignee.id);
        if (!assigneeExists) {
            throw new Error(`User with email ${taskAssigneeEmail} is not assigned to the project.`);
        }
        // Prepare the assignee URL
        const assigneeURL = {
            photoURL: taskAssignee.photoURL,
        };
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
                turnedInAt,
                assigneeURL,
                project: { connect: { id: projectId } },
                taskAssignee: { connect: { email: taskAssigneeEmail } },
                taskCreator: { connect: { id: taskCreatorId } },
            },
        });
        // Restructure the response object
        const response = {
            id: createdTask.id,
            Title: createdTask.title,
            Status: createdTask.status,
            Summary: createdTask.summary,
            type: createdTask.type,
            priority: createdTask.priority,
            dueDate: createdTask.dueDate,
            startDate: createdTask.startDate,
            assigneeURL: createdTask.assigneeURL,
            taskAssigneeId: createdTask.taskAssigneeId,
            projectId: createdTask.projectId,
            taskCreatorId: createdTask.taskCreatorId,
        };
        return response;
    }
    catch (error) {
        throw error;
    }
});
exports.createTask = createTask;
const deleteTask = (_, { taskId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the task exists
        const existingTask = yield db_1.prismaClient.task.findUnique({
            where: { id: taskId },
        });
        if (!existingTask) {
            throw new Error(`Task with ID ${taskId} not found.`);
        }
        // Delete the task
        yield db_1.prismaClient.task.delete({
            where: { id: taskId },
        });
        return { id: taskId };
    }
    catch (error) {
        console.error("Error deleting task:", error);
        throw new Error("Failed to delete task");
    }
});
exports.deleteTask = deleteTask;
const updateTask = (_, _c) => __awaiter(void 0, void 0, void 0, function* () {
    var { taskId, taskAssigneeId } = _c, updatedFields = __rest(_c, ["taskId", "taskAssigneeId"]);
    try {
        // Check if the task exists
        const existingTask = yield db_1.prismaClient.task.findUnique({
            where: { id: taskId },
        });
        if (!existingTask) {
            throw new Error(`Task with ID ${taskId} not found.`);
        }
        if (taskAssigneeId) {
            // Fetch the project to verify taskAssigneeId
            const projectId = existingTask.projectId;
            const project = yield db_1.prismaClient.project.findUnique({
                where: { id: projectId },
            });
            if (!project) {
                throw new Error(`Project with ID ${projectId} not found.`);
            }
            // Check if the task assignee is assigned to the project
            const assigneeExists = project.assigneeIds.includes(taskAssigneeId);
            if (!assigneeExists) {
                throw new Error(`User with ID ${taskAssigneeId} is not assigned to the project.`);
            }
            // Update the task with taskAssignee and project
            const updatedTask = yield db_1.prismaClient.task.update({
                where: { id: taskId },
                data: Object.assign(Object.assign({}, updatedFields), { taskAssignee: { connect: { id: taskAssigneeId } }, project: { connect: { id: projectId } } }),
            });
            // Return the updated task
            return {
                id: updatedTask.id,
                Title: updatedTask.title,
                Status: updatedTask.status,
                Summary: updatedTask.summary,
                type: updatedTask.type,
                priority: updatedTask.priority,
                dueDate: updatedTask.dueDate,
                startDate: updatedTask.startDate,
                taskAssigneeId: updatedTask.taskAssigneeId,
                projectId: updatedTask.projectId,
                taskCreatorId: updatedTask.taskCreatorId,
                turnedInAt: updatedTask.turnedInAt,
                assigneeURL: updatedTask.assigneeURL,
            };
        }
        else {
            // Update the task without updating the project or taskAssignee
            const updatedTask = yield db_1.prismaClient.task.update({
                where: { id: taskId },
                data: updatedFields,
            });
            // Return the updated task
            return {
                id: updatedTask.id,
                Title: updatedTask.title,
                Status: updatedTask.status,
                Summary: updatedTask.summary,
                type: updatedTask.type,
                priority: updatedTask.priority,
                dueDate: updatedTask.dueDate,
                startDate: updatedTask.startDate,
                taskAssigneeId: updatedTask.taskAssigneeId,
                projectId: updatedTask.projectId,
                taskCreatorId: updatedTask.taskCreatorId,
                turnedInAt: updatedTask.turnedInAt,
                assigneeURL: updatedTask.assigneeURL,
            };
        }
    }
    catch (error) {
        console.error("Error updating task:", error);
        throw new Error("Failed to update task");
    }
});
exports.updateTask = updateTask;
//Queries
//Generating JWT Token for User
const generateUserToken = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = payload;
        const user = yield (0, exports.getUserByEmail)(email);
        if (!user) {
            throw new Error("User not found");
        }
        const userSalt = user.salt;
        const hashedPassword = generateHash(userSalt, password);
        if (hashedPassword !== user.password) {
            throw new Error("Invalid password");
        }
        // Generating Token with a longer expiration time (e.g., 1 hour)
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "9h",
        });
        const Token = {
            id: user.id,
            email: user.email,
            name: user.name,
            isManager: user.isManager,
            userToken: token,
            assignedProjectIds: user.assignedProjectIds,
            photoURL: user.photoURL,
        };
        return Token;
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
const getAllProjects = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { creatorId } = payload;
        // Find all projects created by the user with the provided creatorId
        const projects = yield db_1.prismaClient.project.findMany({
            where: {
                creatorId,
            },
        });
        // Transform the projects array to include assignee details
        const transformedProjects = yield Promise.all(projects.map((project) => __awaiter(void 0, void 0, void 0, function* () {
            // Extract assigneeIds from the project
            const { assigneeIds } = project, projectData = __rest(project, ["assigneeIds"]);
            // Fetch user details for each assigneeId
            const assigneeDetails = yield Promise.all(assigneeIds.map((assigneeId) => __awaiter(void 0, void 0, void 0, function* () {
                const user = yield db_1.prismaClient.user.findUnique({
                    where: {
                        id: assigneeId,
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        photoURL: true,
                    },
                });
                return user;
            })));
            // Combine projectData with the transformed assignees array
            return Object.assign(Object.assign({}, projectData), { assigneeDetails });
        })));
        return transformedProjects; // Return the transformed projects array
    }
    catch (error) {
        console.error("Error fetching projects by creator ID:", error);
        throw new Error("Failed to fetch projects by creator ID");
    }
});
exports.getAllProjects = getAllProjects;
const getProjectById = ({ projectId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the project with the provided projectId
        const project = yield db_1.prismaClient.project.findUnique({
            where: {
                id: projectId,
            },
        });
        if (!project) {
            throw new Error("Project not found"); // Throw error if project not found
        }
        // Extract assigneeIds from the project
        const { assigneeIds } = project, projectData = __rest(project, ["assigneeIds"]);
        // Fetch user details for each assigneeId
        const assigneeDetails = yield Promise.all(assigneeIds.map((assigneeId) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield db_1.prismaClient.user.findUnique({
                where: {
                    id: assigneeId,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    photoURL: true,
                },
            });
            return user;
        })));
        // Combine projectData with the transformed assignees array
        const transformedProject = Object.assign(Object.assign({}, projectData), { assigneeDetails });
        return transformedProject; // Return the transformed project
    }
    catch (error) {
        console.error("Error fetching project by ID:", error);
        throw new Error("Failed to fetch project by ID");
    }
});
exports.getProjectById = getProjectById;
const getAllProjectsAssigned = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assigneeId } = payload;
        const projects = yield db_1.prismaClient.project.findMany({
            where: {
                assigneeIds: {
                    has: assigneeId,
                },
            },
        });
        // Transform the projects array to include assignee details
        const transformedProjects = yield Promise.all(projects.map((project) => __awaiter(void 0, void 0, void 0, function* () {
            // Extract assigneeIds from the project
            const { assigneeIds } = project, projectData = __rest(project, ["assigneeIds"]);
            // Fetch user details for each assigneeId
            const assigneeDetails = yield Promise.all(assigneeIds.map((assigneeId) => __awaiter(void 0, void 0, void 0, function* () {
                const user = yield db_1.prismaClient.user.findUnique({
                    where: {
                        id: assigneeId,
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        photoURL: true,
                    },
                });
                return user;
            })));
            // Combine projectData with the transformed assignees array
            return Object.assign(Object.assign({}, projectData), { assigneeDetails });
        })));
        return transformedProjects; // Return the transformed projects array
    }
    catch (error) {
        console.error("Error fetching projects by assignee ID:", error);
        throw new Error("Failed to fetch projects by assignee ID");
    }
});
exports.getAllProjectsAssigned = getAllProjectsAssigned;
const getAllProjectTasks = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = payload;
    try {
        // Find all tasks where projectId matches the provided projectId
        const tasks = yield db_1.prismaClient.task.findMany({
            where: {
                projectId: projectId,
            },
        });
        return tasks;
    }
    catch (error) {
        console.error("Error fetching tasks by project ID:", error);
        throw new Error("Failed to fetch tasks by project ID");
    }
});
exports.getAllProjectTasks = getAllProjectTasks;
const getCreatedTasks = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId, taskCreatorId } = payload;
    try {
        // Find all tasks where projectId and taskAssigneeId match the provided values
        const tasks = yield db_1.prismaClient.task.findMany({
            where: {
                projectId: projectId,
                taskCreatorId: taskCreatorId,
            },
        });
        // Restructure the response to match the desired format
        const formattedTasks = tasks.map((task) => ({
            id: task.id,
            Title: task.title,
            Status: task.status,
            Summary: task.summary,
            type: task.type,
            priority: task.priority,
            dueDate: task.dueDate,
            startDate: task.startDate,
            taskAssigneeId: task.taskAssigneeId,
            projectId: task.projectId,
            taskCreatorId: task.taskCreatorId,
            assigneeURL: task.assigneeURL,
        }));
        return formattedTasks;
    }
    catch (error) {
        console.error("Error fetching tasks by project ID and task creator ID:", error);
        throw new Error("Failed to fetch tasks by project ID and task creator ID");
    }
});
exports.getCreatedTasks = getCreatedTasks;
const getAssignedTasks = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId, taskAssigneeId } = payload;
    try {
        // Find all tasks where projectId and taskAssigneeId match the provided values
        const tasks = yield db_1.prismaClient.task.findMany({
            where: {
                projectId: projectId,
                taskAssigneeId: taskAssigneeId,
            },
        });
        // Restructure the response to match the desired format
        const formattedTasks = tasks.map((task) => ({
            id: task.id,
            Title: task.title,
            Status: task.status,
            Summary: task.summary,
            type: task.type,
            priority: task.priority,
            dueDate: task.dueDate,
            startDate: task.startDate,
            taskAssigneeId: task.taskAssigneeId,
            projectId: task.projectId,
            taskCreatorId: task.taskCreatorId,
            turnedInAt: task.turnedInAt,
            assigneeURL: task.assigneeURL,
        }));
        return formattedTasks;
    }
    catch (error) {
        console.error("Error fetching tasks by project ID and task assignee ID:", error);
        throw new Error("Failed to fetch tasks by project ID and task assignee ID");
    }
});
exports.getAssignedTasks = getAssignedTasks;
const addNotifications = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, notification } = payload;
    try {
        // Add each notification to the database with the userId
        const results = yield Promise.all(notification.map((notification) => db_1.prismaClient.notification.create({
            data: Object.assign(Object.assign({}, notification), { userId: userId }),
        })));
        return results[0];
    }
    catch (error) {
        console.error("Error adding notifications:", error);
        throw new Error("Failed to add notifications");
    }
});
exports.addNotifications = addNotifications;
const addChats = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { chat } = payload;
    try {
        const results = yield db_1.prismaClient.chat.create({
            data: Object.assign({}, chat),
        });
        return results;
    }
    catch (error) {
        console.error("Error adding chats:", error);
        throw new Error("Failed to add chats");
    }
});
exports.addChats = addChats;
const getMemberById = ({ userId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find all tasks where projectId matches the provided projectId
        const user = yield db_1.prismaClient.user.findUnique({
            where: {
                id: userId,
            },
        });
        return user;
    }
    catch (error) {
        throw error;
    }
});
exports.getMemberById = getMemberById;
const getChats = ({ userId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find all tasks where projectId matches the provided projectId
        const chats = yield db_1.prismaClient.chat.findMany({
            where: {
                userId: userId,
            },
        });
        return chats;
    }
    catch (error) {
        throw error;
    }
});
exports.getChats = getChats;
const getNotifications = ({ userId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find all tasks where projectId matches the provided projectId
        const chats = yield db_1.prismaClient.notification.findMany({
            where: {
                userId: userId,
            },
        });
        return chats;
    }
    catch (error) {
        throw error;
    }
});
exports.getNotifications = getNotifications;
const getGoals = ({ userId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find all tasks where projectId matches the provided projectId
        const goals = yield db_1.prismaClient.goal.findMany({
            where: {
                userId: userId,
            },
        });
        return goals;
    }
    catch (error) {
        throw error;
    }
});
exports.getGoals = getGoals;
const getCreatedTasksById = ({ taskCreatorId, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield db_1.prismaClient.task.findMany({
            where: {
                taskCreatorId: taskCreatorId,
                status: {
                    not: "Close",
                },
            },
        });
        // Restructure the response to match the desired format
        const formattedTasks = tasks.map((task) => ({
            id: task.id,
            Title: task.title,
            Status: task.status,
            Summary: task.summary,
            type: task.type,
            priority: task.priority,
            dueDate: task.dueDate,
            startDate: task.startDate,
            taskAssigneeId: task.taskAssigneeId,
            projectId: task.projectId,
            taskCreatorId: task.taskCreatorId,
            turnedInAt: task.turnedInAt,
        }));
        return formattedTasks;
    }
    catch (error) {
        console.error("Error fetching created tasks:", error);
        throw new Error("Failed to fetch tasks");
    }
});
exports.getCreatedTasksById = getCreatedTasksById;
const getAssignedTasksById = ({ taskAssigneeId, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield db_1.prismaClient.task.findMany({
            where: {
                taskAssigneeId: taskAssigneeId,
                status: {
                    not: "Close",
                },
            },
        });
        // Restructure the response to match the desired format
        const formattedTasks = tasks.map((task) => ({
            id: task.id,
            Title: task.title,
            Status: task.status,
            Summary: task.summary,
            type: task.type,
            priority: task.priority,
            dueDate: task.dueDate,
            startDate: task.startDate,
            taskAssigneeId: task.taskAssigneeId,
            projectId: task.projectId,
            taskCreatorId: task.taskCreatorId,
            turnedInAt: task.turnedInAt,
        }));
        return formattedTasks;
    }
    catch (error) {
        console.error("Error fetching assigned tasks:", error);
        throw new Error("Failed to fetch tasks");
    }
});
exports.getAssignedTasksById = getAssignedTasksById;
const getAllCreatedTasksById = ({ taskCreatorId, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield db_1.prismaClient.task.findMany({
            where: {
                taskCreatorId: taskCreatorId,
            },
        });
        // Restructure the response to match the desired format
        const formattedTasks = tasks.map((task) => ({
            id: task.id,
            Title: task.title,
            Status: task.status,
            Summary: task.summary,
            type: task.type,
            priority: task.priority,
            dueDate: task.dueDate,
            startDate: task.startDate,
            taskAssigneeId: task.taskAssigneeId,
            projectId: task.projectId,
            taskCreatorId: task.taskCreatorId,
            turnedInAt: task.turnedInAt,
        }));
        return formattedTasks;
    }
    catch (error) {
        console.error("Error fetching created tasks:", error);
        throw new Error("Failed to fetch tasks");
    }
});
exports.getAllCreatedTasksById = getAllCreatedTasksById;
const getAllAssignedTasksById = ({ taskAssigneeId, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield db_1.prismaClient.task.findMany({
            where: {
                taskAssigneeId: taskAssigneeId,
            },
        });
        // Restructure the response to match the desired format
        const formattedTasks = tasks.map((task) => ({
            id: task.id,
            Title: task.title,
            Status: task.status,
            Summary: task.summary,
            type: task.type,
            priority: task.priority,
            dueDate: task.dueDate,
            startDate: task.startDate,
            taskAssigneeId: task.taskAssigneeId,
            projectId: task.projectId,
            taskCreatorId: task.taskCreatorId,
            turnedInAt: task.turnedInAt,
        }));
        return formattedTasks;
    }
    catch (error) {
        console.error("Error fetching assigned tasks:", error);
        throw new Error("Failed to fetch tasks");
    }
});
exports.getAllAssignedTasksById = getAllAssignedTasksById;
// export const getAllProjects = async (payload: getProjectsPayload) => {
//   try {
//     const { creatorId } = payload;
//     // Find all projects created by the user with the provided creatorId
//     const projects = await prismaClient.project.findMany({
//       where: {
//         creatorId
//       }
//     });
//     // Transform the projects array to include assignee details
//     const transformedProjects = await Promise.all(projects.map(async (project) => {
//       // Extract assigneeIds from the project
//       const { assigneeIds, ...projectData } = project;
//       // Fetch user details for each assigneeId
//       const assigneeDetails = await Promise.all(assigneeIds.map(async (assigneeId) => {
//         const user = await prismaClient.user.findUnique({
//           where: {
//             id: assigneeId
//           },
//           select: {
//             id: true,
//             name: true,
//             email: true
//           }
//         });
//         return user;
//       }));
//       // Combine projectData with the transformed assignees array
//       return {
//         ...projectData,
//         assigneeDetails
//       };
//     }));
//     return transformedProjects; // Return the transformed projects array
//   } catch (error) {
//     console.error('Error fetching projects by creator ID:', error);
//     throw new Error('Failed to fetch projects by creator ID');
//   }
// };
const addGoals = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, goal } = payload;
    try {
        // Add each notification to the database with the userId
        const results = yield Promise.all(goal.map((goal) => db_1.prismaClient.goal.create({
            data: Object.assign(Object.assign({}, goal), { userId: userId }),
        })));
        return results[0];
    }
    catch (error) {
        console.error("Error adding goals:", error);
        throw new Error("Failed to add goals");
    }
});
exports.addGoals = addGoals;
const deleteGoals = (_, { goalId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the goal exists
        const existingGoal = yield db_1.prismaClient.goal.findUnique({
            where: { id: goalId },
        });
        if (!existingGoal) {
            throw new Error(`Goal with ID ${goalId} not found.`);
        }
        // After deleting tasks and updating users, delete the project itself
        yield db_1.prismaClient.goal.delete({
            where: { id: goalId },
        });
        return { id: goalId };
    }
    catch (error) {
        console.error("Error deleting goal:", error);
        throw new Error("Failed to delete goal");
    }
});
exports.deleteGoals = deleteGoals;
const updateGoals = (_, { goalId, isCompleted }, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the goal exists
        const existingGoal = yield db_1.prismaClient.goal.findUnique({
            where: { id: goalId },
        });
        if (!existingGoal) {
            throw new Error(`Goal with ID ${goalId} not found.`);
        }
        // Update the goal and return the updated goal
        const updatedGoal = yield db_1.prismaClient.goal.update({
            where: { id: goalId },
            data: { isCompleted },
        });
        return updatedGoal; // Returning the updated goal object
    }
    catch (error) {
        console.error("Error updating goal:", error);
        throw new Error("Failed to update goal");
    }
});
exports.updateGoals = updateGoals;
const deleteChats = (_, { userId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the user has any chats
        const count = yield db_1.prismaClient.chat.count({
            where: { userId: userId },
        });
        if (count === 0) {
            throw new Error(`No chats found for user ID ${userId}.`);
        }
        // Delete all chats for this user
        yield db_1.prismaClient.chat.deleteMany({
            where: { userId: userId },
        });
        return { userId: userId };
    }
    catch (error) {
        console.error("Error deleting chats:", error);
        throw new Error("Failed to delete chats");
    }
});
exports.deleteChats = deleteChats;
const deleteNotifications = (_, { userId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the user has any notifications
        const count = yield db_1.prismaClient.notification.count({
            where: { userId: userId },
        });
        if (count === 0) {
            throw new Error(`No notifications found for user ID ${userId}.`);
        }
        // Delete all chats for this user
        yield db_1.prismaClient.notification.deleteMany({
            where: { userId: userId },
        });
        return { userId: userId };
    }
    catch (error) {
        console.error("Error deleting notifications:", error);
        throw new Error("Failed to delete notifications");
    }
});
exports.deleteNotifications = deleteNotifications;
const signUpWithOAuth = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, isManager, photoURL } = payload;
    try {
        const user = yield (0, exports.getUserByEmail)(email);
        if (user) {
            throw new Error("User already exists!");
        }
        return db_1.prismaClient.user.create({
            data: {
                email,
                name,
                password: "",
                isManager,
                salt: "",
                photoURL,
            },
        });
    }
    catch (err) {
        // Handle errors
        throw err;
    }
});
exports.signUpWithOAuth = signUpWithOAuth;
const generateOAuthToken = ({ email }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, exports.getUserByEmail)(email);
        if (!user) {
            throw new Error("User not found");
        }
        // Generating Token with a longer expiration time (e.g., 1 hour)
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "9h",
        });
        const Token = {
            id: user.id,
            email: user.email,
            name: user.name,
            isManager: user.isManager,
            userToken: token,
            assignedProjectIds: user.assignedProjectIds,
            photoURL: user.photoURL,
        };
        return Token;
    }
    catch (err) {
        // Handle errors
        throw err;
    }
});
exports.generateOAuthToken = generateOAuthToken;
const updateProfilePicture = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, photoURL } = payload;
    try {
        // const user = await getUserByEmail(email);
        const updatedUser = yield db_1.prismaClient.user.update({
            where: { email },
            data: {
                // ...user,
                photoURL, // Update the profile picture URL
            },
        });
        return updatedUser;
    }
    catch (error) {
        // Handle any errors
        console.error("Error updating profile picture:", error);
        throw error; // Rethrow the error or handle it gracefully
    }
});
exports.updateProfilePicture = updateProfilePicture;
const resetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, newPassword } = payload;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (typeof decoded === "object" && decoded.hasOwnProperty("email")) {
            const email = decoded.email;
            const salt = (0, crypto_1.randomBytes)(32).toString("hex");
            const hashedPassword = generateHash(salt, newPassword);
            yield db_1.prismaClient.user.update({
                where: { email },
                data: { password: hashedPassword, salt },
            });
            return "Password has been reset";
        }
        else {
            throw new Error("Invalid token format");
        }
    }
    catch (error) {
        throw error;
    }
});
exports.resetPassword = resetPassword;
const requestPasswordReset = ({ email }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, exports.getUserByEmail)(email);
        if (!user) {
            throw new Error("User not found");
        }
        const token = jsonwebtoken_1.default.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
        const resetLink = `http://localhost:3000/reset-password/${token}`;
        const mailOptions = {
            from: "taskmt.site@gmail.com",
            to: email,
            subject: "Password Reset",
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
        };
        yield emailTransporter_1.transporter.sendMail(mailOptions);
        return "Password reset email sent";
    }
    catch (error) {
        console.log(error);
    }
});
exports.requestPasswordReset = requestPasswordReset;
