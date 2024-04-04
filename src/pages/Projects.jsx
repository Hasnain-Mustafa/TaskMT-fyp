import React, { useState , useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Box, TextField } from '@mui/material';
import { createProject, deleteProject } from '../features/projects/projectActions'; // Import the createProject action
import { useNavigate } from 'react-router-dom';
import { setCredentials  } from '../features/projects/projectSlice'
import { useStateContext } from '../contexts/ContextProvider';
import { useGetAllProjectsQuery} from '../app/services/projects/projectsService'
import ProjectCard from '../components/ProjectCard'
const Projects = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.projects);
  const { currentColor } = useStateContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    title: '',
    status: '', 
    summary: '', 
    weeks: '', 
    budget: '', 
    assigneeEmails: [],
    creatorId: userInfo.id // Set creatorId directly to userInfo.id
  });

  const { data, isFetching} = useGetAllProjectsQuery({ creatorId: userInfo.id });

  useEffect(() => {
    console.log(data)
    if (data) dispatch(setCredentials(data?.getAllProjects))
    deleteProject();
  }, [data, dispatch])
  const onViewDetails = () => {
    navigate('/menu-tab');
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // If the field is assigneeEmails, split the input by commas to create an array
    const updatedValue = name === 'assigneeEmails' ? value.split(',').map(email => email.trim()) : value;
  
    setNewProjectData({ ...newProjectData, [name]: updatedValue });
  };

  const handleAddProject = () => {
    console.log(newProjectData)
    dispatch(createProject(newProjectData));
   
    handleCloseModal();
    setNewProjectData({
      title: '',
      status: '', 
      summary: '', 
      weeks: '', 
      budget: '', 
      assigneeEmails: [],
      creatorId: userInfo.id // Set creatorId directly to userInfo.id
    });
  };

  const handleDeleteProject = (projectId) => {
 dispatch(deleteProject({projectId}))
  };
  return (
    <div className="p-6">
      <div className="mb-4">
        <Button className="text-xs" variant="outlined" onClick={handleOpenModal} style={{ color: currentColor }}>
          Add Project
        </Button>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            name={project.title}
            description={project.summary}
            onDelete={() => handleDeleteProject(project.id)}
            onViewDetails={onViewDetails} 
          />
        ))}
      </div>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <TextField
            fullWidth
            label="Project Title"
            name="title"
            value={newProjectData.title}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Project Status"
            name="status"
            value={newProjectData.status}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Project Summary"
            name="summary"
            value={newProjectData.summary}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Project Weeks"
            name="weeks"
            value={newProjectData.weeks}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Project Budget"
            name="budget"
            value={newProjectData.budget}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Assignee Emails"
            name="assigneeEmails"
            value={newProjectData.assigneeEmails}
            onChange={handleInputChange}
            margin="normal"
          />
          <Button variant="contained" onClick={handleAddProject}>
            Add Project
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Projects;
