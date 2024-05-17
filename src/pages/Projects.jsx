import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { setProjects } from "../features/projects/projectSlice";
import { deleteProject } from "../features/projects/projectActions";
import {
  useGetAllProjectsQuery,
  useGetAllProjectsAssignedQuery,
} from "../app/services/projects/projectsService";
import ProjectCard from "../components/ProjectCard";
import CreateProjectsModal from "../components/CreateProjectsModal";
import { motion, AnimatePresence } from "framer-motion";
import { framerButtonVariants } from "../components/framer";
import { gql } from "@apollo/client";
import client from "../ApolloClient";
import { useStateContext } from "../contexts/ContextProvider";
import CardComponent from "../components/CardComponent";
import { Header } from "../components";
import MonthlyGoalsCard from "../components/MonthlyGoalsCard";
const Projects = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.projects);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const { currentColor } = useStateContext();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  // Queries
  const { data, isFetching } =
    userInfo.isManager == "true"
      ? useGetAllProjectsQuery(
          { creatorId: userInfo.id },
          {
            refetchOnMountOrArgChange: true,
            skip: false,
            selectFromResult: (data) => data,
          }
        )
      : useGetAllProjectsAssignedQuery(
          { assigneeId: userInfo.id },
          {
            refetchOnMountOrArgChange: true,
            skip: false,
            selectFromResult: (data) => data,
          }
        );

  // Effect to handle project data loading
  useEffect(() => {
    if (data) {
      const actionPayload =
        userInfo.isManager == "true"
          ? data?.getAllProjects
          : data?.getAllProjectsAssigned;
      setTimeout(() => {
        dispatch(setProjects(actionPayload));
      }, 250);
    }
  }, [data, dispatch, userInfo.isManager]);

  const onViewDetails = (projectId) => {
    navigate(`/kanban/${projectId}`);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalData(null);
  };

  // const handleDeleteProject = (projectId) => {
  //   dispatch(deleteProject({ projectId }));
  // };
  const handleDeleteProject = () => {
    dispatch(deleteProject({ projectId: projectToDelete }));
    closeConfirmDialog();
  };

  const openConfirmDialog = (projectId) => {
    setProjectToDelete(projectId);
    setConfirmOpen(true);
  };

  const closeConfirmDialog = () => {
    setConfirmOpen(false);
    setProjectToDelete(null);
  };

  const handleEditProject = async (projectId) => {
    const projectData = await fetchProject(projectId);

    setOpenModal(true);

    setModalData({
      ...projectData,
      projectId: projectData.id,
      assigneeEmails: projectData.assigneeDetails.map((a) => a.email),
    });
  };
  const fetchProject = async (projectId) => {
    console.log(projectId);
    const { data, error } = await client.query({
      query: gql`
        query GetProjectById($projectId: String!) {
          getProjectById(projectId: $projectId) {
            title
            id
            status
            summary
            weeks
            budget
            assigneeDetails {
              email
            }
            creatorId
          }
        }
      `,
      variables: { projectId },
    });
    if (error) {
      console.error("Error fetching project details:", error);
      return null;
    }
    return data.getProjectById;
  };
  return (
    <div className="p-6">
      {userInfo.isManager === "true" ? (
        <div className="mb-4">
          <Button
            onClick={handleOpenModal}
            component={motion.div}
            {...framerButtonVariants}
            style={{
              color: "#fff",
              backgroundColor: currentColor,
              borderRadius: "9999px",
              padding: "0.6rem 1rem",
              fontSize: "0.95rem",
              textTransform: "none",
            }}
          >
            Add Project
          </Button>
        </div>
      ) : (
        <div className="mb-4">Assigned Projects</div>
      )}
      <div className="flex flex-wrap justify-center space-y-4 md:space-y-0 md:space-x-4 p-5">
        <div className="mb-8">
          <CardComponent />
        </div>
        <div className="m-8">
          <MonthlyGoalsCard />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onViewDetails={onViewDetails}
            onDelete={() => openConfirmDialog(project.id)}
            onEdit={() => handleEditProject(project.id)}
          />
        ))}
      </div>
      <AnimatePresence initial={false}>
        {openModal && (
          <CreateProjectsModal
            handleCloseModal={handleCloseModal}
            initialData={modalData}
          />
        )}
      </AnimatePresence>
      <Dialog
        open={confirmOpen}
        onClose={closeConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiDialog-paper": {
            width: "auto", // Automatically adjust width to content
            maxWidth: "360px", // Maintain a manageable maximum width
            backgroundColor: currentColor, // Use dynamic color from context
            color: "#fff", // White text for general content
            borderRadius: "8px", // Rounded corners
          },
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ color: "#fff" }}>
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ color: "#fff" }}
          >
            Are you sure you want to delete this project? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog} sx={{ color: "#fff" }}>
            Cancel
          </Button>

          <Button
            onClick={handleDeleteProject}
            autoFocus
            className="bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            style={{ color: "#ef4444" }} // Force the text color inline
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Projects;
