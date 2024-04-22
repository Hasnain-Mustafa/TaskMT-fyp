import { createHmac, randomBytes } from 'crypto';
import { prismaClient } from '../lib/db';
import JWT from 'jsonwebtoken';

export interface signUpTypes {
  email: string;
  name: string;
  password: string;
  isManager: boolean;
}

export interface UserTokenPayload {
  email: string;
  password: string;
}

export interface getProjectsPayload{
  creatorId: string
}
export interface getAssignedProjectsPayload{
  assigneeId: string
}
export interface CreateProjectInput {
  title: string;
  status: string;
  summary: string;
  weeks: string;
  budget: string;
  assigneeEmails: string[];
  creatorId: string;
  
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
  
}
export interface getProjectTasksPayload{
  projectId: string
}
export interface getAssignedTasksPayload{
  projectId: string;
  taskAssigneeId:string

}
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined.');
}

const generateHash = (salt: string, password: string) => {
  const hashedPassword = createHmac('sha256', salt)
    .update(password)
    .digest('hex');
  return hashedPassword;
};

// User Signup
export const signUpUser = async (payload: signUpTypes) => {
  const { email, name, password, isManager } = payload;

  const salt = randomBytes(32).toString('hex');
  const hashedPassword = generateHash(salt, password);

  return prismaClient.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      isManager,
      salt,
    },
  });
};

export const createProject = async (payload: CreateProjectInput) => {
  try {
    const { title, status, summary, weeks, budget, assigneeEmails, creatorId } = payload;

    let allUsersFound = true;

    // Check if all users exist
    await Promise.all(assigneeEmails.map(async (assigneeEmail) => {
      const user = await prismaClient.user.findUnique({
        where: { email: assigneeEmail }
      });
      if (!user) {
        console.error(`User with email ${assigneeEmail} not found.`);
        allUsersFound = false;
      }
    }));

    if (!allUsersFound) {
      throw new Error('Not all users were found. Project creation aborted.');
    }

    // Create the project
    const createdProject = await prismaClient.project.create({
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

  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error('Failed to create project');
  }
};



export const deleteProject = async (_: any, { projectId }: { projectId: string }) => {
  try {
    // Check if the project exists
    const existingProject = await prismaClient.project.findUnique({
      where: { id: projectId }
    });

    if (!existingProject) {
      throw new Error(`Project with ID ${projectId} not found.`);
    }

    // Check if there are tasks associated with the project
    const tasksInProject = await prismaClient.task.findMany({
      where: { projectId: projectId }
    });

    if (tasksInProject.length > 0) {
      // If tasks exist, delete them first
      await Promise.all(tasksInProject.map(async (task) => {
        await prismaClient.task.delete({
          where: { id: task.id }
        });
      }));
    }

    // Retrieve users with the project in assignedProjectIds
    const usersWithProject = await prismaClient.user.findMany({
      where: { assignedProjectIds: { has: projectId } }
    });

    // Update each user document to remove the project from assignedProjectIds
    await Promise.all(usersWithProject.map(async (user) => {
      await prismaClient.user.update({
        where: { id: user.id },
        data: { assignedProjectIds: { set: user.assignedProjectIds.filter(id => id !== projectId) } }
      });
    }));

    // After deleting tasks and updating users, delete the project itself
    await prismaClient.project.delete({
      where: { id: projectId }
    });

    return {id : projectId};
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('Failed to delete project');
  }
};

export const updateProject = async (
  _: any,
  { projectId, assigneeEmails, ...updatedFields }: { projectId: string; assigneeEmails: string[]; [key: string]: any }
) => {
  try {
    // Check if the project exists
    const existingProject = await prismaClient.project.findUnique({
      where: { id: projectId }
    });

    if (!existingProject) {
      throw new Error(`Project with ID ${projectId} not found.`);
    }

    // Fetch the project to verify assigneeEmails
    if (assigneeEmails && assigneeEmails.length > 0) {
      let allUsersFound = true;

      // Check if all users exist
      await Promise.all(assigneeEmails.map(async (assigneeEmail) => {
        const user = await prismaClient.user.findUnique({
          where: { email: assigneeEmail }
        });
        if (!user) {
          console.error(`User with email ${assigneeEmail} not found.`);
          allUsersFound = false;
        }
      }));

      if (!allUsersFound) {
        throw new Error('Not all users were found. Project updation aborted.');
      }

      // Update the project and connect the assignees
      await prismaClient.project.update({
        where: { id: projectId },
        data: {
          ...updatedFields,
          assignees: { connect: assigneeEmails.map(email => ({ email })) }
        }
      });
    } else {
      // Update the project without updating the assignees
      await prismaClient.project.update({
        where: { id: projectId },
        data: updatedFields
      });
    }

    return `Project with ID ${projectId} has been updated successfully.`;
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
};

export const deleteProjectMember = async (
  _: any,
  { projectId, memberEmail, assigneeEmails, ...updatedFields }: { projectId: string; memberEmail: string; assigneeEmails: string[]; [key: string]: any }
) => {
  try {
    // Check if the project exists
    const existingProject = await prismaClient.project.findUnique({
      where: { id: projectId }
    });

    if (!existingProject) {
      throw new Error(`Project with ID ${projectId} not found.`);
    }

    // Remove the memberEmail from assigneeEmails if it's defined
    const updatedAssigneeEmails = assigneeEmails ? assigneeEmails.filter(email => email !== memberEmail) : [];

    // Update the project and connect the assignees
    await prismaClient.project.update({
      where: { id: projectId },
      data: {
        ...updatedFields,
        assignees: { connect: updatedAssigneeEmails.map(email => ({ email })) }
      }
    });

    // Remove memberEmail from the project explicitly
    await prismaClient.project.update({
      where: { id: projectId },
      data: {
        assignees: { disconnect: { email: memberEmail } }
      }
    });

    // Find the user corresponding to memberEmail to get the user ID
    const memberUser = await prismaClient.user.findUnique({
      where: { email: memberEmail }
    });

    if (!memberUser) {
      console.error(`User with email ${memberEmail} not found.`);
      throw new Error(`User with email ${memberEmail} not found.`);
    }

    // Check if there are any tasks assigned to memberUser and delete them
    const tasksAssignedToMember = await prismaClient.task.findMany({
      where: { taskAssigneeId: memberUser.id ,projectId: projectId}
    });

    if (tasksAssignedToMember.length > 0) {
      await Promise.all(tasksAssignedToMember.map(async (task) => {
        await prismaClient.task.delete({
          where: { id: task.id }
        });
      }));
    }

    return `Member with email ${memberEmail} has been removed from the project with ID ${projectId}.`;
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
};

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
    export const createTask = async (payload: CreateTaskInput) => {
      try {
        const { title, status, summary, type, priority, taskAssigneeEmail, projectId, dueDate, startDate } = payload;
    console.log(projectId)
   
        // Fetch the project to verify taskAssigneeEmail
        const project = await prismaClient.project.findUnique({
          where: { id: projectId }
        });
    
        if (!project) {
          throw new Error(`Project with ID ${projectId} not found.`);
        }
    
        // Check if the task assignee is assigned to the project
        const taskAssignee = await prismaClient.user.findUnique({
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
        const createdTask = await prismaClient.task.create({
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
      taskAssigneeId: createdTask.taskAssigneeId,
      projectId: createdTask.projectId
    };

    console.log(response);
    return response;
      
      } catch (error) {
        console.error('Error creating task:', error);
        throw new Error('Failed to create task');
      }
    };
    
    
  export const deleteTask = async (_: any, { taskId }: { taskId: string }) => {
      try {
        // Check if the task exists
        const existingTask = await prismaClient.task.findUnique({
          where: { id: taskId }
        });
    
        if (!existingTask) {
          throw new Error(`Task with ID ${taskId} not found.`);
        }
    
        // Delete the task
        await prismaClient.task.delete({
          where: { id: taskId }
        });
    
        return { id: taskId };
      } catch (error) {
        console.error('Error deleting task:', error);
        throw new Error('Failed to delete task');
      }
    };
    export const updateTask = async (
      _: any,
      { taskId, taskAssigneeId, ...updatedFields }: { taskId: string; taskAssigneeId: string; [key: string]: any }
    ) => {
      try {
        // Check if the task exists
        const existingTask = await prismaClient.task.findUnique({
          where: { id: taskId }
        });
    
        if (!existingTask) {
          throw new Error(`Task with ID ${taskId} not found.`);
        }
    
        if (taskAssigneeId) {
          // Fetch the project to verify taskAssigneeId
          const projectId = existingTask.projectId;
    
          const project = await prismaClient.project.findUnique({
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
    
          // Update the task with taskAssignee and project
          const updatedTask = await prismaClient.task.update({
            where: { id: taskId },
            data: {
              ...updatedFields,
              taskAssignee: { connect: { id: taskAssigneeId } },
              project: { connect: { id: projectId } }
            }
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
            projectId: updatedTask.projectId
          };
        } else {
          // Update the task without updating the project or taskAssignee
          const updatedTask = await prismaClient.task.update({
            where: { id: taskId },
            data: updatedFields
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
            projectId: updatedTask.projectId
          };
        }
      } catch (error) {
        console.error('Error updating task:', error);
        throw new Error('Failed to update task');
      }
    };
    
    //Queries
//Generating JWT Token for User
export const generateUserToken = async (payload: UserTokenPayload) => {
  try {
    const { email, password } = payload;
    const user = await getUserByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    const userSalt = user.salt;
    const hashedPassword = generateHash(userSalt, password);

    if (hashedPassword !== user.password) {
      throw new Error('Invalid password');
    }

    // Generating Token with a longer expiration time (e.g., 1 hour)
    const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '9h',
    });
const Token ={
id :user.id,
email: user.email,
name: user.name,
isManager: user.isManager,
userToken : token,
assignedProjectIds : user.assignedProjectIds
}
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
    const {creatorId} =payload;
    console.log(creatorId);
    // Find all projects created by the user with the provided creatorId
    const projects = await prismaClient.project.findMany({
      where: {
        creatorId
      }
    });

    return projects;
  } catch (error) {
    console.error('Error fetching projects by creator ID:', error);
    throw new Error('Failed to fetch projects by creator ID');
  }
};

export const getAllProjectsAssigned = async (payload: getAssignedProjectsPayload) => {
  try {
    const {assigneeId} =payload;

    const projects = await prismaClient.project.findMany({
      where: {
        assigneeIds: {
          has: assigneeId
        }
      }
    });
    return projects;
  } catch (error) {
    console.error('Error fetching projects by assignee ID:', error);
    throw new Error('Failed to fetch projects by assignee ID');
  }
};

export const getAllProjectTasks = async (payload: getProjectTasksPayload) => {
 const{projectId}=payload;
try {
  // Find all tasks where projectId matches the provided projectId
  const tasks = await prismaClient.task.findMany({
    where: {
      projectId: projectId
    }
  });

  return tasks;
} catch (error) {
  console.error('Error fetching tasks by project ID:', error);
  throw new Error('Failed to fetch tasks by project ID');
}
};
export const getAssignedTasks =  async (payload: getAssignedTasksPayload) => {
  const{projectId,taskAssigneeId}=payload;
  try {
    // Find all tasks where projectId and taskAssigneeId match the provided values
    const tasks = await prismaClient.task.findMany({
      where: {
        projectId: projectId,
        taskAssigneeId: taskAssigneeId
      }
    });

   // Restructure the response to match the desired format
   const formattedTasks = tasks.map(task => ({
    id: task.id,
    Title: task.title,
    Status: task.status,
    Summary: task.summary,
    type: task.type,
    priority: task.priority,
    dueDate: task.dueDate,
    startDate: task.startDate,
    taskAssigneeId: task.taskAssigneeId,
    projectId: task.projectId
  }));

  return formattedTasks;
  } catch (error) {
    console.error('Error fetching tasks by project ID and task assignee ID:', error);
    throw new Error('Failed to fetch tasks by project ID and task assignee ID');
  }
};

