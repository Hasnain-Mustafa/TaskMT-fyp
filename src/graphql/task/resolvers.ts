import { CreateTaskInput,getAllProjectTasks,getProjectTasksPayload,getAssignedTasks,getAssignedTasksPayload } from '../../services/userService';
import { createTask,deleteTask,updateTask } from '../../services/userService';

const queries = {
  getAllProjectTasks: async (_: any, payload: getProjectTasksPayload) => {
    try{
    const res = await getAllProjectTasks(payload);
    return res;
    }catch (error) {
      // Handle any errors that occur during project creation
      console.error('Error fetching created projects:', error);
      throw new Error('Failed to fetch project');
    }
  },
  getAssignedTasks: async (_: any, payload: getAssignedTasksPayload) => {
    try{
    const res = await getAssignedTasks(payload);
    return res;
    }catch (error) {
      
      console.error('Error fetching assigned tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  }
 
};

const mutations = {
  createTask: async (_: any, payload: CreateTaskInput ) => {
    try {
      // Call the createTask function from userService.ts
      const res = await createTask(payload);
      return res.id;
    } catch (error) {
      // Handle any errors that occur during task creation
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }
  },

  deleteTask,
  updateTask
};
export const resolvers = { queries,mutations };