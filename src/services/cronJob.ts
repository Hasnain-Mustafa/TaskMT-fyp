import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import { addNotifications, NotificationPayload } from './userService';  // Ensure path is correct
import { sendNewsletterEmail } from './emailTransporter';
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
   // Schedule a job to run every Monday at 9:00 AM (you can adjust the timing as needed)
cron.schedule('0 9 * * 1', async () => {
    console.log('Running a task every Monday at 9:00 AM');
  
    try {
      const subscribers = await prisma.subscriber.findMany();
      subscribers.forEach(subscriber => {
        sendNewsletterEmail(
            subscriber.email,
            'Weekly Newsletter',
            `Welcome to this week's edition of the TaskMT Digest! Every week, we bring you the best tips, insights, and updates to help you and your team achieve peak productivity.
          
          Feature Spotlight: Interactive Task Board
          
          Our interactive task board is more than just a tool; it’s your gateway to flawless project management. Have you tried the drag-and-drop functionality yet? It’s designed to make task management fluid and responsive to your team’s changing priorities. Remember, a well-organized workflow is the backbone of successful project completion!
          
          Productivity Tip of the Week:
          
          Break large tasks into smaller, manageable sub-tasks. This not only makes it easier to start working on complex projects but also provides a clear roadmap of progress and milestones. Check out how TaskMT allows you to categorize and assign these sub-tasks for maximum efficiency.
          
          Success Story:
          
          This week, we're featuring a case study from Acme Corp, who recently streamlined their entire operation using TaskMT. With our task management platform, they’ve seen a 25% increase in productivity and a 40% improvement in task completion rates. Dive into the full story on our blog!
          
          What’s New?
          
          Stay tuned for our upcoming feature release next month. We're excited to introduce TaskMT Calendar Integration, which will allow you to sync your tasks directly with Google Calendar, ensuring you never miss a deadline or meeting.
          
          Engage with Us:
          
          Don’t forget, our real-time chat interface isn’t just for work; it's also a space for you and your team to connect and share. How has TaskMT enhanced your team interactions? Reply to this email or ping us in the chat—we love hearing from you!
          
          Stay Connected:
          
          Follow us on our social media platforms to get real-time updates and join our community of efficient organizers and productivity enthusiasts.
          
          Thank you for being a part of the TaskMT community. Your success is our priority, and we’re here to support every step of your journey towards achieving it.
          
          Warm regards,
          
          The TaskMT Team`
          );
          
      });
    } catch (error) {
      console.error('Failed to retrieve subscribers or send emails:', error);
    }
  });
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
