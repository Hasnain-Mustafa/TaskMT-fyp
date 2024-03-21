import { CreateTaskInput } from '../../services/userService';
import { createTask,deleteTask,updateTask } from '../../services/userService';

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
export const resolvers = { mutations };