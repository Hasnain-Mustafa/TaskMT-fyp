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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCronJobs = void 0;
const client_1 = require("@prisma/client");
const node_cron_1 = __importDefault(require("node-cron"));
const userService_1 = require("./userService"); // Ensure path is correct
const prisma = new client_1.PrismaClient();
const getCurrentFormattedTime = () => {
    return new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};
const sendNotificationToUser = (userId, title, message, description) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Notify ${userId} about task: ${title}`);
    const notification = {
        image: "", // Provide a valid URL or a path to an image
        message: `Task ${title} ${message} `,
        desc: description,
        time: getCurrentFormattedTime(),
    };
    const payload = {
        userId: userId,
        notification: [notification]
    };
    try {
        yield (0, userService_1.addNotifications)(payload);
        console.log(`Notification sent to user ${userId} about task ${title}`);
    }
    catch (error) {
        console.error('Error sending notification:', error);
    }
});
const startCronJobs = () => {
    // Notify users when tasks are past due
    node_cron_1.default.schedule('0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Checking for overdue tasks every 30 seconds');
        const overdueTasks = yield prisma.task.findMany({
            where: {
                dueDate: {
                    lt: new Date().toISOString(),
                },
                status: {
                    not: "Close",
                },
            },
            include: {
                taskAssignee: true,
            },
        });
        overdueTasks.forEach(task => {
            if (task.taskAssigneeId) {
                sendNotificationToUser(task.taskAssigneeId, task.title, "is past due", "Please update or complete the task as soon as possible.").catch(console.error);
            }
        });
    }));
    // */120 * * * * *
    // Notify users when tasks are due tomorrow
    node_cron_1.default.schedule(' 0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Checking for tasks due tomorrow');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const startOfDay = new Date(tomorrow.setHours(0, 0, 0, 0));
        const endOfDay = new Date(tomorrow.setHours(23, 59, 59, 999));
        const dueTomorrowTasks = yield prisma.task.findMany({
            where: {
                dueDate: {
                    gte: startOfDay.toISOString(),
                    lte: endOfDay.toISOString(),
                },
                status: {
                    not: "Close",
                },
            },
            include: {
                taskAssignee: true,
            },
        });
        dueTomorrowTasks.forEach(task => {
            if (task.taskAssigneeId) {
                sendNotificationToUser(task.taskAssigneeId, task.title, "is due tomorrow", "Let’s nail it!").catch(console.error);
            }
        });
    }));
};
exports.startCronJobs = startCronJobs;
