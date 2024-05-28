import { createHmac, randomBytes } from "crypto";
import { prismaClient } from "../lib/db";
import JWT from "jsonwebtoken";
import { transporter } from "./emailTransporter";

export interface signUpTypes {
  email: string;
  name: string;
  password: string;
  isManager: boolean;
  photoURL: string;
}

export interface UserTokenPayload {
  email: string;
  password: string;
}
export interface UpdatePicturePayload {
  email: string;
  photoURL: string;
}

export interface signUpWithOAuthTypes {
  email: string;
  name: string;
  isManager: boolean;
  photoURL: string;
}
export interface getProjectsPayload {
  creatorId: string;
}
export interface getAssignedProjectsPayload {
  assigneeId: string;
}
export interface CreateProjectInput {
  title: string;
  status: string;
  summary: string;
  weeks: number;
  budget: number;
  assigneeEmails: string[];
  creatorId: string;
}
// interface Chat {
//   image: string;
//   message: string;
//   desc: string;
//   time: string;
// }
export interface ChatPayload {
  chat: {
    userId: string;
    image: string;
    sender: string;
    message: string;
    desc: string;
    time: string;
  };
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

interface Notification {
  image: string;
  message: string;
  desc: string;
  time: string;
}
export interface NotificationPayload {
  userId: string;
  notification: Notification[];
}
interface Goal {
  text: string;
  isCompleted: boolean;
}
export interface GoalPayload {
  userId: string;
  goal: Goal[];
}

export interface CreateTaskInput {
  title: string;
  status: string;
  summary: string;
  type: string;
  priority: string;
  dueDate: string;
  startDate: string;
  taskAssigneeEmail: string;
  projectId: string;
  taskCreatorId: string;
  turnedInAt: string;
}
export interface getProjectTasksPayload {
  projectId: string;
}
export interface getAssignedTasksPayload {
  projectId: string;
  taskAssigneeId: string;
}
export interface getCreatedTasksPayload {
  projectId: string;
  taskCreatorId: string;
}
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined.");
}

const generateHash = (salt: string, password: string) => {
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  return hashedPassword;
};

// User Signup
export const signUpUser = async (payload: signUpTypes) => {
  const { email, name, password, isManager, photoURL } = payload;
  try {
    const user = await getUserByEmail(email);
    if (user) {
      throw new Error("User already exists!");
    }

    const salt = randomBytes(32).toString("hex");
    const hashedPassword = generateHash(salt, password);

    return prismaClient.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        isManager,
        salt,
        photoURL,
      },
    });
  } catch (err: any) {
    // Handle errors
    throw err;
  }
};
function isValidEmail(email: string) {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

export const createProject = async (payload: CreateProjectInput) => {
  const { title, status, summary, weeks, budget, assigneeEmails, creatorId } =
    payload;
  let allUsersFound = true;
  let managerAssigned = false;
  let assigneeIds = []; // Store user IDs of assignees

  for (const email of assigneeEmails) {
    if (!isValidEmail(email)) {
      throw new Error(`Invalid email format: ${email}`);
    }

    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      allUsersFound = false;
      throw new Error(`User with email ${email} not found.`);
    } else if (user.isManager) {
      managerAssigned = true;
      throw new Error(
        `User with email ${email} is a manager and cannot be assigned to projects.`
      );
    } else {
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
    const createdProject = await prismaClient.project.create({
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
  } catch (err) {
    throw err;
  }
};

export const deleteProjects = async (
  _: any,
  { projectIds }: { projectIds: string[] }
) => {
  try {
    // Retrieve all projects that match the array of projectIds
    const existingProjects = await prismaClient.project.findMany({
      where: { id: { in: projectIds } },
    });

    // Map of existing project IDs for quick lookup
    const existingProjectIds = new Set(
      existingProjects.map((project) => project.id)
    );

    // Filter out non-existent projects to avoid errors
    const validProjectIds = projectIds.filter((id) =>
      existingProjectIds.has(id)
    );

    if (validProjectIds.length === 0) {
      throw new Error("No valid project IDs found.");
    }

    // Retrieve all tasks associated with the valid projects
    const tasksInProjects = await prismaClient.task.findMany({
      where: { projectId: { in: validProjectIds } },
    });

    // Delete all tasks associated with these projects
    if (tasksInProjects.length > 0) {
      await Promise.all(
        tasksInProjects.map(async (task) => {
          await prismaClient.task.delete({
            where: { id: task.id },
          });
        })
      );
    }

    // Retrieve users with any of the projects in assignedProjectIds
    const usersWithProjects = await prismaClient.user.findMany({
      where: { assignedProjectIds: { hasSome: validProjectIds } },
    });

    // Update each user document to remove the projects from assignedProjectIds
    await Promise.all(
      usersWithProjects.map(async (user) => {
        const updatedProjectIds = user.assignedProjectIds.filter(
          (id) => !validProjectIds.includes(id)
        );
        await prismaClient.user.update({
          where: { id: user.id },
          data: { assignedProjectIds: { set: updatedProjectIds } },
        });
      })
    );

    // After tasks and users have been updated, delete the projects themselves
    await Promise.all(
      validProjectIds.map(async (projectId) => {
        await prismaClient.project.delete({
          where: { id: projectId },
        });
      })
    );

    return { ids: validProjectIds }; // Return the IDs of deleted projects
  } catch (error) {
    console.error("Error deleting projects:", error);
    throw new Error("Failed to delete projects");
  }
};

export const deleteProject = async (
  _: any,
  { projectId }: { projectId: string }
) => {
  try {
    // Check if the project exists
    const existingProject = await prismaClient.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      throw new Error(`Project with ID ${projectId} not found.`);
    }

    // Check if there are tasks associated with the project
    const tasksInProject = await prismaClient.task.findMany({
      where: { projectId: projectId },
    });

    if (tasksInProject.length > 0) {
      // If tasks exist, delete them first
      await Promise.all(
        tasksInProject.map(async (task) => {
          await prismaClient.task.delete({
            where: { id: task.id },
          });
        })
      );
    }

    // Retrieve users with the project in assignedProjectIds
    const usersWithProject = await prismaClient.user.findMany({
      where: { assignedProjectIds: { has: projectId } },
    });

    // Update each user document to remove the project from assignedProjectIds
    await Promise.all(
      usersWithProject.map(async (user) => {
        await prismaClient.user.update({
          where: { id: user.id },
          data: {
            assignedProjectIds: {
              set: user.assignedProjectIds.filter((id) => id !== projectId),
            },
          },
        });
      })
    );

    // After deleting tasks and updating users, delete the project itself
    await prismaClient.project.delete({
      where: { id: projectId },
    });

    return { id: projectId };
  } catch (error) {
    console.error("Error deleting project:", error);
    throw new Error("Failed to delete project");
  }
};

export const updateProject = async (
  _: any,
  { projectId, ...updatedFields }: { projectId: string; [key: string]: any }
) => {
  try {
    // Check if the project exists
    const existingProject = await prismaClient.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      throw new Error(`Project with ID ${projectId} not found.`);
    }

    // Update the project without updating the assignees
    const project = await prismaClient.project.update({
      where: { id: projectId },
      data: updatedFields,
    });

    return project;
  } catch (error) {
    console.error("Error updating project:", error);
    throw new Error("Failed to update project");
  }
};

export const deleteProjectMember = async (
  _: any,
  {
    projectId,
    memberEmail,
    assigneeEmails,
    ...updatedFields
  }: {
    projectId: string;
    memberEmail: string;
    assigneeEmails: string[];
    [key: string]: any;
  }
) => {
  try {
    // Check if the project exists
    const existingProject = await prismaClient.project.findUnique({
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
    await prismaClient.project.update({
      where: { id: projectId },
      data: {
        ...updatedFields,
        assignees: {
          connect: updatedAssigneeEmails.map((email) => ({ email })),
        },
      },
    });

    // Remove memberEmail from the project explicitly
    await prismaClient.project.update({
      where: { id: projectId },
      data: {
        assignees: { disconnect: { email: memberEmail } },
      },
    });

    // Find the user corresponding to memberEmail to get the user ID
    const memberUser = await prismaClient.user.findUnique({
      where: { email: memberEmail },
    });

    if (!memberUser) {
      console.error(`User with email ${memberEmail} not found.`);
      throw new Error(`User with email ${memberEmail} not found.`);
    }

    // Check if there are any tasks assigned to memberUser and delete them
    const tasksAssignedToMember = await prismaClient.task.findMany({
      where: { taskAssigneeId: memberUser.id, projectId: projectId },
    });

    if (tasksAssignedToMember.length > 0) {
      await Promise.all(
        tasksAssignedToMember.map(async (task) => {
          await prismaClient.task.delete({
            where: { id: task.id },
          });
        })
      );
    }

    return `Member with email ${memberEmail} has been removed from the project with ID ${projectId}.`;
  } catch (error) {
    console.error("Error updating project:", error);
    throw new Error("Failed to update project");
  }
};

export const createTask = async (payload: CreateTaskInput) => {
  try {
    const {
      title,
      status,
      summary,
      type,
      priority,
      taskAssigneeEmail,
      projectId,
      dueDate,
      startDate,
      taskCreatorId,
      turnedInAt,
    } = payload;

    // Validate that all required variables are present
    if (
      !title ||
      !status ||
      !summary ||
      !type ||
      !priority ||
      !taskAssigneeEmail ||
      !projectId ||
      !dueDate ||
      !startDate ||
      !taskCreatorId
    ) {
      throw new Error("All fields are required.");
    }

    // Fetch the project to verify taskAssigneeEmail
    const project = await prismaClient.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error(`Project with ID ${projectId} not found.`);
    }

    // Check if the task assignee is assigned to the project
    const taskAssignee = await prismaClient.user.findUnique({
      where: { email: taskAssigneeEmail },
    });

    if (!taskAssignee) {
      throw new Error(`User with email ${taskAssigneeEmail} not found.`);
    }

    const assigneeExists = project.assigneeIds.includes(taskAssignee.id);
    if (!assigneeExists) {
      throw new Error(
        `User with email ${taskAssigneeEmail} is not assigned to the project.`
      );
    }

    // Prepare the assignee URL
    const assigneeURL = {
      photoURL: taskAssignee.photoURL,
    };

    // Create the task
    const createdTask = await prismaClient.task.create({
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
  } catch (error) {
    throw error;
  }
};

export const deleteTask = async (_: any, { taskId }: { taskId: string }) => {
  try {
    // Check if the task exists
    const existingTask = await prismaClient.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      throw new Error(`Task with ID ${taskId} not found.`);
    }

    // Delete the task
    await prismaClient.task.delete({
      where: { id: taskId },
    });

    return { id: taskId };
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error("Failed to delete task");
  }
};
export const updateTask = async (
  _: any,
  {
    taskId,
    taskAssigneeId,
    ...updatedFields
  }: { taskId: string; taskAssigneeId: string; [key: string]: any }
) => {
  try {
    // Check if the task exists
    const existingTask = await prismaClient.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      throw new Error(`Task with ID ${taskId} not found.`);
    }

    if (taskAssigneeId) {
      // Fetch the project to verify taskAssigneeId
      const projectId = existingTask.projectId;

      const project = await prismaClient.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new Error(`Project with ID ${projectId} not found.`);
      }

      // Check if the task assignee is assigned to the project
      const assigneeExists = project.assigneeIds.includes(taskAssigneeId);

      if (!assigneeExists) {
        throw new Error(
          `User with ID ${taskAssigneeId} is not assigned to the project.`
        );
      }

      // Update the task with taskAssignee and project
      const updatedTask = await prismaClient.task.update({
        where: { id: taskId },
        data: {
          ...updatedFields,
          taskAssignee: { connect: { id: taskAssigneeId } },
          project: { connect: { id: projectId } },
        },
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
    } else {
      // Update the task without updating the project or taskAssignee
      const updatedTask = await prismaClient.task.update({
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
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Failed to update task");
  }
};

//Queries
//Generating JWT Token for User
export const generateUserToken = async (payload: UserTokenPayload) => {
  try {
    const { email, password } = payload;
    const user = await getUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const userSalt = user.salt;
    const hashedPassword = generateHash(userSalt, password);

    if (hashedPassword !== user.password) {
      throw new Error("Invalid password");
    }

    // Generating Token with a longer expiration time (e.g., 1 hour)
    const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET, {
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
  } catch (err: any) {
    // Handle errors
    throw new Error(`Error generating user token: ${err.message}`);
  }
};

export const decodeJWTToken = (token: string) => {
  return JWT.verify(token, JWT_SECRET);
};

export const getUserByEmail = (email: string) => {
  return prismaClient.user.findUnique({
    where: { email },
  });
};

export const getUserById = (id: string) => {
  return prismaClient.user.findUnique({
    where: { id },
  });
};

export const getAllProjects = async (payload: getProjectsPayload) => {
  try {
    const { creatorId } = payload;

    // Find all projects created by the user with the provided creatorId
    const projects = await prismaClient.project.findMany({
      where: {
        creatorId,
      },
    });

    // Transform the projects array to include assignee details
    const transformedProjects = await Promise.all(
      projects.map(async (project) => {
        // Extract assigneeIds from the project
        const { assigneeIds, ...projectData } = project;

        // Fetch user details for each assigneeId
        const assigneeDetails = await Promise.all(
          assigneeIds.map(async (assigneeId) => {
            const user = await prismaClient.user.findUnique({
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
          })
        );

        // Combine projectData with the transformed assignees array
        return {
          ...projectData,
          assigneeDetails,
        };
      })
    );

    return transformedProjects; // Return the transformed projects array
  } catch (error) {
    console.error("Error fetching projects by creator ID:", error);
    throw new Error("Failed to fetch projects by creator ID");
  }
};
export const getProjectById = async ({ projectId }: { projectId: string }) => {
  try {
    // Find the project with the provided projectId
    const project = await prismaClient.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      throw new Error("Project not found"); // Throw error if project not found
    }

    // Extract assigneeIds from the project
    const { assigneeIds, ...projectData } = project;

    // Fetch user details for each assigneeId
    const assigneeDetails = await Promise.all(
      assigneeIds.map(async (assigneeId) => {
        const user = await prismaClient.user.findUnique({
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
      })
    );

    // Combine projectData with the transformed assignees array
    const transformedProject = {
      ...projectData,
      assigneeDetails,
    };

    return transformedProject; // Return the transformed project
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    throw new Error("Failed to fetch project by ID");
  }
};

export const getAllProjectsAssigned = async (
  payload: getAssignedProjectsPayload
) => {
  try {
    const { assigneeId } = payload;

    const projects = await prismaClient.project.findMany({
      where: {
        assigneeIds: {
          has: assigneeId,
        },
      },
    });
    // Transform the projects array to include assignee details
    const transformedProjects = await Promise.all(
      projects.map(async (project) => {
        // Extract assigneeIds from the project

        const { assigneeIds, ...projectData } = project;

        // Fetch user details for each assigneeId
        const assigneeDetails = await Promise.all(
          assigneeIds.map(async (assigneeId) => {
            const user = await prismaClient.user.findUnique({
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
          })
        );

        // Combine projectData with the transformed assignees array
        return {
          ...projectData,
          assigneeDetails,
        };
      })
    );

    return transformedProjects; // Return the transformed projects array
  } catch (error) {
    console.error("Error fetching projects by assignee ID:", error);
    throw new Error("Failed to fetch projects by assignee ID");
  }
};

export const getAllProjectTasks = async (payload: getProjectTasksPayload) => {
  const { projectId } = payload;
  try {
    // Find all tasks where projectId matches the provided projectId
    const tasks = await prismaClient.task.findMany({
      where: {
        projectId: projectId,
      },
    });

    return tasks;
  } catch (error) {
    console.error("Error fetching tasks by project ID:", error);
    throw new Error("Failed to fetch tasks by project ID");
  }
};
export const getCreatedTasks = async (payload: getCreatedTasksPayload) => {
  const { projectId, taskCreatorId } = payload;
  try {
    // Find all tasks where projectId and taskAssigneeId match the provided values
    const tasks = await prismaClient.task.findMany({
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
  } catch (error) {
    console.error(
      "Error fetching tasks by project ID and task creator ID:",
      error
    );
    throw new Error("Failed to fetch tasks by project ID and task creator ID");
  }
};

export const getAssignedTasks = async (payload: getAssignedTasksPayload) => {
  const { projectId, taskAssigneeId } = payload;
  try {
    // Find all tasks where projectId and taskAssigneeId match the provided values
    const tasks = await prismaClient.task.findMany({
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
  } catch (error) {
    console.error(
      "Error fetching tasks by project ID and task assignee ID:",
      error
    );
    throw new Error("Failed to fetch tasks by project ID and task assignee ID");
  }
};
export const addNotifications = async (payload: NotificationPayload) => {
  const { userId, notification } = payload;
  try {
    // Add each notification to the database with the userId
    const results = await Promise.all(
      notification.map((notification) =>
        prismaClient.notification.create({
          data: {
            ...notification,
            userId: userId,
          },
        })
      )
    );

    return results[0];
  } catch (error) {
    console.error("Error adding notifications:", error);
    throw new Error("Failed to add notifications");
  }
};
export const addChats = async (payload: ChatPayload) => {
  const { chat } = payload;
  try {
    const results = await prismaClient.chat.create({
      data: {
        ...chat,
      },
    });
    return results;
  } catch (error) {
    console.error("Error adding chats:", error);
    throw new Error("Failed to add chats");
  }
};
export const getMemberById = async ({ userId }: { userId: string }) => {
  try {
    // Find all tasks where projectId matches the provided projectId
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user;
  } catch (error) {
    throw error;
  }
};
export const getChats = async ({ userId }: { userId: string }) => {
  try {
    // Find all tasks where projectId matches the provided projectId
    const chats = await prismaClient.chat.findMany({
      where: {
        userId: userId,
      },
    });

    return chats;
  } catch (error) {
    throw error;
  }
};
export const getNotifications = async ({ userId }: { userId: string }) => {
  try {
    // Find all tasks where projectId matches the provided projectId
    const chats = await prismaClient.notification.findMany({
      where: {
        userId: userId,
      },
    });

    return chats;
  } catch (error) {
    throw error;
  }
};
export const getGoals = async ({ userId }: { userId: string }) => {
  try {
    // Find all tasks where projectId matches the provided projectId
    const goals = await prismaClient.goal.findMany({
      where: {
        userId: userId,
      },
    });

    return goals;
  } catch (error) {
    throw error;
  }
};
export const getCreatedTasksById = async ({
  taskCreatorId,
}: {
  taskCreatorId: string;
}) => {
  try {
    const tasks = await prismaClient.task.findMany({
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
  } catch (error) {
    console.error("Error fetching created tasks:", error);
    throw new Error("Failed to fetch tasks");
  }
};

export const getAssignedTasksById = async ({
  taskAssigneeId,
}: {
  taskAssigneeId: string;
}) => {
  try {
    const tasks = await prismaClient.task.findMany({
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
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
    throw new Error("Failed to fetch tasks");
  }
};

export const getAllCreatedTasksById = async ({
  taskCreatorId,
}: {
  taskCreatorId: string;
}) => {
  try {
    const tasks = await prismaClient.task.findMany({
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
  } catch (error) {
    console.error("Error fetching created tasks:", error);
    throw new Error("Failed to fetch tasks");
  }
};

export const getAllAssignedTasksById = async ({
  taskAssigneeId,
}: {
  taskAssigneeId: string;
}) => {
  try {
    const tasks = await prismaClient.task.findMany({
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
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
    throw new Error("Failed to fetch tasks");
  }
};

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
export const addGoals = async (payload: GoalPayload) => {
  const { userId, goal } = payload;
  try {
    // Add each notification to the database with the userId
    const results = await Promise.all(
      goal.map((goal) =>
        prismaClient.goal.create({
          data: {
            ...goal,
            userId: userId,
          },
        })
      )
    );
    return results[0];
  } catch (error) {
    console.error("Error adding goals:", error);
    throw new Error("Failed to add goals");
  }
};
export const deleteGoals = async (_: any, { goalId }: { goalId: string }) => {
  try {
    // Check if the goal exists
    const existingGoal = await prismaClient.goal.findUnique({
      where: { id: goalId },
    });
    if (!existingGoal) {
      throw new Error(`Goal with ID ${goalId} not found.`);
    }

    // After deleting tasks and updating users, delete the project itself
    await prismaClient.goal.delete({
      where: { id: goalId },
    });

    return { id: goalId };
  } catch (error) {
    console.error("Error deleting goal:", error);
    throw new Error("Failed to delete goal");
  }
};
export const updateGoals = async (
  _: any,
  { goalId, isCompleted }: { goalId: string; isCompleted: boolean },
  context: any
) => {
  try {
    // Check if the goal exists
    const existingGoal = await prismaClient.goal.findUnique({
      where: { id: goalId },
    });

    if (!existingGoal) {
      throw new Error(`Goal with ID ${goalId} not found.`);
    }

    // Update the goal and return the updated goal
    const updatedGoal = await prismaClient.goal.update({
      where: { id: goalId },
      data: { isCompleted },
    });

    return updatedGoal; // Returning the updated goal object
  } catch (error) {
    console.error("Error updating goal:", error);
    throw new Error("Failed to update goal");
  }
};
export const deleteChats = async (_: any, { userId }: { userId: string }) => {
  try {
    // Check if the user has any chats
    const count = await prismaClient.chat.count({
      where: { userId: userId },
    });

    if (count === 0) {
      throw new Error(`No chats found for user ID ${userId}.`);
    }

    // Delete all chats for this user
    await prismaClient.chat.deleteMany({
      where: { userId: userId },
    });

    return { userId: userId };
  } catch (error) {
    console.error("Error deleting chats:", error);
    throw new Error("Failed to delete chats");
  }
};
export const deleteNotifications = async (
  _: any,
  { userId }: { userId: string }
) => {
  try {
    // Check if the user has any notifications
    const count = await prismaClient.notification.count({
      where: { userId: userId },
    });

    if (count === 0) {
      throw new Error(`No notifications found for user ID ${userId}.`);
    }

    // Delete all chats for this user
    await prismaClient.notification.deleteMany({
      where: { userId: userId },
    });

    return { userId: userId };
  } catch (error) {
    console.error("Error deleting notifications:", error);
    throw new Error("Failed to delete notifications");
  }
};

export const signUpWithOAuth = async (payload: signUpWithOAuthTypes) => {
  const { email, name, isManager, photoURL } = payload;
  try {
    const user = await getUserByEmail(email);

    if (user) {
      throw new Error("User already exists!");
    }
    return prismaClient.user.create({
      data: {
        email,
        name,
        password: "",
        isManager,
        salt: "",
        photoURL,
      },
    });
  } catch (err: any) {
    // Handle errors
    throw err;
  }
};
export const generateOAuthToken = async ({ email }: { email: string }) => {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    // Generating Token with a longer expiration time (e.g., 1 hour)
    const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET, {
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
  } catch (err: any) {
    // Handle errors
    throw err;
  }
};
export const updateProfilePicture = async (payload: UpdatePicturePayload) => {
  const { email, photoURL } = payload;
  try {
    // const user = await getUserByEmail(email);
    const updatedUser = await prismaClient.user.update({
      where: { email },
      data: {
        // ...user,
        photoURL, // Update the profile picture URL
      },
    });

    return updatedUser;
  } catch (error) {
    // Handle any errors
    console.error("Error updating profile picture:", error);
    throw error; // Rethrow the error or handle it gracefully
  }
};

export const resetPassword = async (payload: ResetPasswordPayload) => {
  const { token, newPassword } = payload;
  try {
    const decoded = JWT.verify(token, JWT_SECRET);
    if (typeof decoded === "object" && decoded.hasOwnProperty("email")) {
      const email = decoded.email;

      const salt = randomBytes(32).toString("hex");
      const hashedPassword = generateHash(salt, newPassword);

      await prismaClient.user.update({
        where: { email },
        data: { password: hashedPassword, salt },
      });

      return "Password has been reset";
    } else {
      throw new Error("Invalid token format");
    }
  } catch (error) {
    throw error;
  }
};
export const requestPasswordReset = async ({ email }: { email: string }) => {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const token = JWT.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
    const resetLink = `https://taskmt.live/reset-password/${token}`;

    const mailOptions = {
      from: "taskmt.site@gmail.com",
      to: email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
    };

    await transporter.sendMail(mailOptions);
    return "Password reset email sent";
  } catch (error) {
    console.log(error);
  }
};
