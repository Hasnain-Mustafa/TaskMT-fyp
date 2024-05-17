import { CreateTaskInput,getAllProjectTasks,getProjectTasksPayload,getCreatedTasksById,getAssignedTasks,getAllCreatedTasksById,getAssignedTasksPayload, getCreatedTasks,getCreatedTasksPayload ,getAssignedTasksById, getAllAssignedTasksById} from '../../services/userService';
import { createTask,deleteTask,updateTask,getUserById } from '../../services/userService';

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
    console.log(res)
    return res;
    }catch (error) {
      
      console.error('Error fetching assigned tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  },
  getCreatedTasks: async (_: any, payload: getCreatedTasksPayload) => {
    try{
    const res = await getCreatedTasks(payload);
    console.log(res)
    return res;
    }catch (error) {
      
      console.error('Error fetching created tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  },
  // getTaskAssigneeById: async (_: any,  { taskAssigneeId }: { taskAssigneeId: string }) => {
  //   try {
     
  //     // Call your data source/service to fetch the user by ID
  //     const user = await getUserById(taskAssigneeId);
  //     console.log(user)
  //     return user;
  //   } catch (error) {
  //     // Handle errors
  //     throw new Error('Failed to fetch user by ID');
  //   }
  // },
  getAssignedTasksById: async (_: any,  { taskAssigneeId }: { taskAssigneeId: string }) => {
    try{
    const res = await getAssignedTasksById({taskAssigneeId});
    console.log(res)
    return res;
    }catch (error) {
      
      console.error('Error fetching assigned tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  },
  getCreatedTasksById: async (_: any,  { taskCreatorId }: { taskCreatorId: string }) => {
    try{
    const res = await getAllCreatedTasksById({taskCreatorId});
    console.log(res)
    return res;
    }catch (error) {
      
      console.error('Error fetching created tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  },
  getAllAssignedTasksById: async (_: any,  { taskAssigneeId }: { taskAssigneeId: string }) => {
    try{
    const res = await getAllAssignedTasksById({taskAssigneeId});
    console.log(res)
    return res;
    }catch (error) {
      
      console.error('Error fetching assigned tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  },
  getAllCreatedTasksById: async (_: any,  { taskCreatorId }: { taskCreatorId: string }) => {
    try{
    const res = await getAllCreatedTasksById({taskCreatorId});
    console.log(res)
    return res;
    }catch (error) {
      
      console.error('Error fetching created tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  },
 
};

const mutations = {
  createTask: async (_: any, payload: CreateTaskInput ) => {
    try {
      // Call the createTask function from userService.ts
      const res = await createTask(payload);
      console.log(res)
      return res;
    } catch (error) {
    
      throw new Error(`${error}`);
    }
  },

  deleteTask,
  updateTask
};
export const resolvers = { queries,mutations };