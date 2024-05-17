import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDotCircle,
  faSpinner,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  useGetAllProjectsQuery,
  useGetAllProjectsAssignedQuery,
} from "../app/services/projects/projectsService";
import { fetchProjectTasks } from "../features/projects/projectActions";
import CountUp from "../pages/landing/sections/countUp";
import { setProjectStats } from "../features/projects/projectSlice";
const CardComponent = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { projectStats, projects } = useSelector((state) => state.projects);

  const { data: projectsData, isFetching } =
    userInfo.isManager == "true"
      ? useGetAllProjectsQuery({ creatorId: userInfo.id })
      : useGetAllProjectsAssignedQuery({ assigneeId: userInfo.id });

  useEffect(() => {
    if (projectsData && !isFetching) {
      const actionPayload =
        userInfo.isManager == "true"
          ? projectsData.getAllProjects
          : projectsData.getAllProjectsAssigned;
      console.log(actionPayload);
      const fetchTasksAndUpdateProjects = async () => {
        let totalTasksCompleted = 0;
        let projectsInProgress = 0;
        let projectsCompleted = 0;
        let projectsStopped = 0;

        await Promise.all(
          actionPayload?.map(async (project) => {
            if (project.assigneeDetails && project.assigneeDetails.length > 0) {
              const tasks = (
                await Promise.all(
                  project.assigneeDetails.map((assignee) =>
                    fetchProjectTasks(project.id, assignee.id)
                  )
                )
              ).flat();

              const totalTasks = tasks.length;
              const closedTasks = tasks.filter(
                (task) => task.Status === "Close"
              ).length;
              totalTasksCompleted += closedTasks;

              const progress =
                totalTasks > 0
                  ? Math.floor((closedTasks / totalTasks) * 100)
                  : 0;
              if (progress === 100) {
                projectsCompleted++;
              } else if (progress > 0) {
                projectsInProgress++;
              } else if (progress === 0) {
                projectsStopped++;
              }
            }
          })
        );

        dispatch(
          setProjectStats({
            totalProjects: actionPayload.length,
            tasksCompleted: totalTasksCompleted,
            projectsInProgress: projectsInProgress,
            projectsCompleted: projectsCompleted,
            projectsStopped: projectsStopped,
          })
        );
      };

      fetchTasksAndUpdateProjects();
    }
  }, [projectsData, isFetching, userInfo.isManager]);

  const stats = [
    { name: "Projects", icon: faDotCircle, count: projects.length },
    {
      name: "In Progress",
      icon: faSpinner,
      count: projectStats.projectsInProgress,
    },
    {
      name: "Completed",
      icon: faCheckCircle,
      count: projectStats.projectsCompleted,
    },
  ];

  return (
    <div className="bg-gray-700 p-4 rounded-xl max-w-xs h-88 text-gray-300 shadow-xl">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-sm font-medium text-white">Overall Information</h1>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
          <div className="h-3 w-3 rounded-full bg-gray-50"></div>
        </div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="font-bold text-3xl text-white px-3 py-1 mr-2 ">
            <CountUp maxCount={projectStats.tasksCompleted} />
          </div>
          <div className="text-xs">Tasks done for all time</div>
        </div>
        <div className="bg-gray-500 h-6 w-px"></div>
        <div className="flex items-center">
          <div className="font-bold text-3xl text-white px-3 py-1 mr-2">
            {/* <CountUp maxCount={projectStats.projectsStopped} /> */}
            {projectStats.projectsStopped}
          </div>
          <div className="text-xs">projects are stopped</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center ">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow-md p-2 text-center"
          >
            <div className="flex flex-col items-center text-gray-800">
              <FontAwesomeIcon icon={stat.icon} size="lg" className="mb-1" />
              <div className="text-xl font-bold mb-1">
                {" "}
                <CountUp maxCount={stat.count} startCount={0} />
              </div>
              <div className="text-xs font-semibold">{stat.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardComponent;
