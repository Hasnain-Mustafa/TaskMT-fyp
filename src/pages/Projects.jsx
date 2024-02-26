// Projects.js
import React, { useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { TextField } from '@mui/material';
import { useStateContext } from '../contexts/ContextProvider';
import { useNavigate } from 'react-router-dom';
const Projects = () => {
  const { currentColor } = useStateContext();
  const [projectList, setProjectList] = useState([
    { id: 1, name: 'Project 1', description: 'Description for Project 1' },
    // Add more projects as needed
  ]);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [newProjectData, setNewProjectData] = useState({ name: '', description: '' });

  const addProject = () => {
    const newProject = {
      id: projectList.length + 1,
      name: newProjectData.name,
      description: newProjectData.description,
    };

    setProjectList([...projectList, newProject]);
    setOpenModal(false);
    setNewProjectData({ name: '', description: '' });
  };

  const deleteProject = (projectId) => {
    const updatedProjects = projectList.filter((project) => project.id !== projectId);
    setProjectList(updatedProjects);
  };


  const onViewDetails = () => {
    // Replace '/details' with the actual URL you want to navigate to
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
    setNewProjectData({ ...newProjectData, [name]: value });
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <Button className="text-xs" variant="outlined" onClick={handleOpenModal}  style={{ color: currentColor }}>
          Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        {projectList.map((project) => (
          <ProjectCard
            key={project.id}
            name={project.name}
            description={project.description}
            onDelete={() => deleteProject(project.id)}
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
            label="Project Name"
            name="name"
            value={newProjectData.name}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Project Description"
            name="description"
            value={newProjectData.description}
            onChange={handleInputChange}
            margin="normal"
          />
          <Button variant="contained" onClick={addProject}  >
            Add Project
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Projects;
