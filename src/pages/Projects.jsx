import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Modal, Box, TextField } from "@mui/material";

import {
  createProject,
  deleteProject,
} from "../features/projects/projectActions";
import { getCurrentFormattedTime } from "../utils/utils";
import avatar from "../data/avatar.jpg";
import { pushNotifications } from "../features/auth/authActions";
import { useNavigate } from "react-router-dom";
import { setCredentials, setProjects } from "../features/projects/projectSlice";
import { useStateContext } from "../contexts/ContextProvider";
import {
  useGetAllProjectsQuery,
  useGetAllProjectsAssignedQuery,
} from "../app/services/projects/projectsService";
import ProjectCard from "../components/ProjectCard";
import { Header } from "../components";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import CardComponent from "../components/CardComponent";
import MonthlyGoalsCard from "../components/MonthlyGoalsCard";
import CreateProjectsModal from "../components/CreateProjectsModal";
import { framerButtonVariants } from "../components/framer";
import { zodResolver } from "@hookform/resolvers/zod";
const Projects = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.projects);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const { currentColor } = useStateContext();

  // Conditionally using different queries based on the user's role
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

  const onViewDetails = async (projectId) => {
    console.log(projectId);
    navigate(`/kanban/${projectId}`);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   const updatedValue =
  //     name === "assigneeEmails"
  //       ? value.split(",").map((email) => email.trim())
  //       : value;
  //   setNewProjectData({ ...newProjectData, [name]: updatedValue });
  // };

  // const handleAddProject = () => {
  //   const projectData = dispatch(createProject(newProjectData));
  //   projectData.then((result) => {
  //     console.log(result);
  //     if (result && result.meta.requestStatus) {
  //       console.log(result.meta.requestStatus);
  //       if (result.meta.requestStatus === "rejected") {
  //         toast.error(result.payload);
  //       } else if (result.meta.requestStatus === "fulfilled") {
  //         toast.success("Project Created");
  //         result.payload.assigneeIds.forEach((assignee) => {
  //           dispatch(
  //             pushNotifications({
  //               userId: assignee,
  //               notification: [
  //                 {
  //                   image: "",
  //                   message: `You have been assigned to project ${result.payload.title}`,
  //                   desc: "Check the project details and start working on your tasks.",
  //                   time: getCurrentFormattedTime(),
  //                 },
  //               ],
  //             })
  //           );
  //         }); // Correct placement of the closing parenthesis and semicolon for forEach

  //         handleCloseModal();
  //         setNewProjectData({
  //           title: "",
  //           status: "",
  //           summary: "",
  //           weeks: "",
  //           budget: "",
  //           assigneeEmails: [],
  //           creatorId: userInfo.id,
  //         });
  //       }
  //     }
  //   });
  // };
  const handleDeleteProject = (projectId) => {
    dispatch(deleteProject({ projectId }));
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
        <Header title="Assigned Projects" />
      )}
      <div className="flex flex-wrap justify-center space-y-4 md:space-y-0 md:space-x-4 p-5">
        <div className="mb-8">
          <CardComponent />
        </div>
        <div className="m-8">
          <MonthlyGoalsCard />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-20">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onViewDetails={onViewDetails}
            onDelete={() => handleDeleteProject(project.id)}
          />
        ))}
      </div>
      <AnimatePresence initial={false}>
        {openModal && (
          <CreateProjectsModal
            handleCloseModal={handleCloseModal}
            // handleAddProject={handleAddProject}
            // newProjectData={newProjectData}
            // setNewProjectData={setNewProjectData}
            // email={email} // Passing email to the modal
            // setEmail={setEmail} // Passing setEmail to the modal
          />
        )}
      </AnimatePresence>
      {/* <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
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
      </Modal> */}
    </div>
  );
};

export default Projects;
