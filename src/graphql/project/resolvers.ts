import { CreateProjectInput } from '../../services/userService';
import { createProject, updateProject,deleteProject,deleteProjectMember } from '../../services/userService';

const mutations = {
  createProject: async (_: any, payload: CreateProjectInput ) => {
    try {
      // Call the createProject function from userService.ts
      const res = await createProject(payload);
      return res.id;
    } catch (error) {
      // Handle any errors that occur during project creation
      console.error('Error creating project:', error);
      throw new Error('Failed to create project');
    }
  },
  updateProject,
  deleteProject,
  deleteProjectMember
};
export const resolvers = { mutations };