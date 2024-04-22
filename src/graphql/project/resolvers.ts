import { CreateProjectInput, getProjectsPayload, getAllProjects,getAssignedProjectsPayload,getAllProjectsAssigned } from '../../services/userService';
import { createProject, updateProject,deleteProject,deleteProjectMember } from '../../services/userService';


const queries = {
  getAllProjects: async (_: any, payload: getProjectsPayload) => {
    try{
    const res = await getAllProjects(payload);
    return res;
    }catch (error) {
      // Handle any errors that occur during project creation
      console.error('Error fetching created projects:', error);
      throw new Error('Failed to fetch project');
    }
  },
  getAllProjectsAssigned: async (_: any, payload: getAssignedProjectsPayload) => {
    try{
    const res = await getAllProjectsAssigned(payload);
    return res;
    }catch (error) {
     
      console.error('Error fetching assigned projects:', error);
      throw new Error('Failed to fetch project');
    }
  },
};

const mutations = {
  createProject: async (_: any, payload: CreateProjectInput ) => {
    try {
      // Call the createProject function from userService.ts
      const res = await createProject(payload);
      return res;
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
export const resolvers = { queries,mutations };