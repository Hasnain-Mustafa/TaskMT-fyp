import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import { addNotifications, NotificationPayload } from './userService';  // Ensure path is correct

const prisma = new PrismaClient();

const getCurrentFormattedTime = (): string => {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const sendNotificationToUser = async (userId: string, title: string,message:string, description: string): Promise<void> => {
    console.log(`Notify ${userId} about task: ${title}`);
    const notification = {
        image: "", // Provide a valid URL or a path to an image
        message: `Task ${title} ${message} `,
        desc: description,
        time: getCurrentFormattedTime(),
    };

    const payload: NotificationPayload = {
        userId: userId,
        notification: [notification]
    };

    try {
        await addNotifications(payload);
        console.log(`Notification sent to user ${userId} about task ${title}`);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

export const startCronJobs = (): void => {
    // Notify users when tasks are past due
    cron.schedule('0 0 * * *', async () => {
        console.log('Checking for overdue tasks every 30 seconds');
        const overdueTasks = await prisma.task.findMany({
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
                sendNotificationToUser(task.taskAssigneeId, task.title, "is past due","Please update or complete the task as soon as possible.").catch(console.error);
            }
        });
    });
    // */120 * * * * *
   
    // Notify users when tasks are due tomorrow
    cron.schedule(' 0 0 * * *', async () => {
        console.log('Checking for tasks due tomorrow');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const startOfDay = new Date(tomorrow.setHours(0, 0, 0, 0));
        const endOfDay = new Date(tomorrow.setHours(23, 59, 59, 999));

        const dueTomorrowTasks = await prisma.task.findMany({
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
                sendNotificationToUser(task.taskAssigneeId, task.title, "is due tomorrow","Let’s nail it!").catch(console.error);
            }
        });
    });
};
