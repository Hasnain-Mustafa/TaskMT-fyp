import React, { useEffect, useState } from "react";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Selection,
  Inject,
  Edit,
  Toolbar,
  Sort,
  Filter,
} from "@syncfusion/ej2-react-grids";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useSelector, useDispatch } from "react-redux";
import { Header } from "../components";

import {
  fetchProjectTasks,
  deleteProjects,
} from "../features/projects/projectActions";
import {
  useGetAllProjectsQuery,
  useGetAllProjectsAssignedQuery,
} from "../app/services/projects/projectsService";
// Define or import customerGridImage and customerGridStatus functions if used

const Portfolio = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [projectsData, setProjectsData] = useState([]);

  // Configure selection settings based on user's role
  const selectionSettings =
    userInfo.isManager === "true"
      ? {
          persistSelection: true,
          type: "Multiple",
          checkboxOnly: true,
        }
      : {};

  // Configure toolbar options based on user's role
  const toolbarOptions = userInfo.isManager === "true" ? ["Delete"] : [];
  const editing = {
    allowDeleting: userInfo.isManager === "true",
    allowEditing: false,
  };

  const [selectedRowsData, setSelectedRowsData] = useState([]);

  const { data, isFetching } =
    userInfo.isManager === "true"
      ? useGetAllProjectsQuery(
          {
            creatorId: userInfo.id,
          },
          {
            refetchOnMountOrArgChange: true,
            skip: false,
            selectFromResult: (data) => data,
          }
        )
      : useGetAllProjectsAssignedQuery(
          {
            assigneeId: userInfo.id,
          },
          {
            refetchOnMountOrArgChange: true,
            skip: false,
            selectFromResult: (data) => data,
          }
        );

  const handleSelectAll = (args) => {
    const allProjectIds = projectsData.map((project) => project.id); // Extract IDs or relevant data
    setSelectedRowsData(allProjectIds);
  };

  const handleClearSelection = () => {
    setSelectedRowsData([]); // Clear all selections
  };

  const onRowSelected = (args) => {
    if (Array.isArray(args?.data)) {
      const selectedIds = args.data.map((item) => item.id); // Assuming 'index' is the identifier
      setSelectedRowsData(
        (prevSelectedRowsData) => [
          ...new Set([...prevSelectedRowsData, ...selectedIds]),
        ] // Use Set to avoid duplicates
      );
    } else {
      const selectedId = args?.data?.id;
      setSelectedRowsData(
        (prevSelectedRowsData) => [
          ...new Set([...prevSelectedRowsData, selectedId]),
        ] // Use Set to avoid duplicates
      );
    }
  };

  const onRowDeselected = (args) => {
    if (Array.isArray(args?.data)) {
      const deselectedIds = args.data.map((item) => item.index); // Assuming 'index' is the identifier
      setSelectedRowsData((prevSelectedRowsData) =>
        prevSelectedRowsData.filter((id) => !deselectedIds.includes(id))
      );
    } else {
      const deselectedId = args?.data?.index;
      setSelectedRowsData((prevSelectedRowsData) =>
        prevSelectedRowsData.filter((id) => id !== deselectedId)
      );
    }
  };

  const handleToolbarClick = (args) => {
    dispatch(deleteProjects({ projectIds: selectedRowsData }));
    setSelectedRowsData([]); // Clear the selection after deleting
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "red"; //red
      case "Pending":
        return "#FEC90F"; // Orange
      case "Completed":
        return "#8BE78B"; // Green
    }
  };

  const renderProgress = (props) => {
    return (
      <div style={{ width: 50 }}>
        <CircularProgressbar
          value={props?.Progress}
          text={`${props?.Progress}%`}
          styles={{ path: { stroke: props?.progressBarColor } }}
        />
      </div>
    );
  };

  const customerGridStatus = (props) => (
    <div className="flex gap-2 justify-center items-center text-gray-700 capitalize">
      <p
        style={{ background: getStatusColor(props.status) }}
        className="rounded-full h-3 w-3"
      />
      <p>{props.status}</p>
    </div>
  );

  const customerGridImage = (props) => {
    return (
      <div className="image flex gap-4 items-center">
        <img
          className="rounded-full w-10 h-10"
          src={props?.assignee?.photoURL}
          alt="image"
        />
        <div>
          <p>{props?.assignee?.name}</p>
          <p>{props?.assignee?.email}</p>
        </div>
      </div>
    );
  };

  const baseColumns = [
    {
      field: "index",
      headerText: "ID",
      width: "150",
      textAlign: "Center",
      isPrimaryKey: true,
    },
    {
      field: "name",
      headerText: "Name",
      width: "200",
      template: customerGridImage,
      textAlign: "Center",
    },
    {
      field: "title",
      headerText: "Project Name",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "status",
      headerText: "Status",
      width: "130",
      textAlign: "Center",
      template: customerGridStatus,
    },
    { field: "weeks", headerText: "Weeks", width: "100", textAlign: "Center" },
    {
      field: "budget",
      headerText: "Budget",
      width: "100",
      textAlign: "Center",
    },
    {
      field: "Progress",
      headerText: "Progress",
      width: "120",
      template: renderProgress,
      textAlign: "Center",
    },
  ];

  const managerColumns = [{ type: "checkbox", width: "50" }, ...baseColumns];

  const customersGrid =
    userInfo.isManager === "true" ? managerColumns : baseColumns;

  useEffect(() => {
    if (data && !isFetching) {
      const actionPayload =
        userInfo.isManager === "true"
          ? data?.getAllProjects
          : data?.getAllProjectsAssigned;

      const fetchTasksAndUpdateProjects = async () => {
        const updatedProjects = await Promise.all(
          actionPayload.map(async (project, idx) => {
            let status = "Pending"; // Default status
            if (project.assigneeDetails && project.assigneeDetails.length > 0) {
              const tasks = await Promise.all(
                project.assigneeDetails.map((assignee) =>
                  fetchProjectTasks(project.id, assignee.id)
                )
              );
              const allTasks = tasks.flat();
              const totalTasks = allTasks.length;
              const closedTasks = allTasks.filter(
                (task) => task.Status === "Close"
              ).length;
              const progress =
                totalTasks > 0
                  ? Math.floor((closedTasks / totalTasks) * 100)
                  : 0;
              const progressBarColor =
                progress < 50
                  ? "#ff0000"
                  : progress < 100
                  ? "#ffff00"
                  : "#00ff00";

              if (progress === 100) {
                status = "Completed";
              } else if (progress > 0) {
                status = "Active";
              }

              return project.assigneeDetails.map((assignee, index) => ({
                ...project,
                Progress: progress,
                progressBarColor,
                status,
                index: idx + index + 1, // Add 1 to ensure unique index starting from 1
                assignee,
              }));
            }
            return {
              ...project,
              Progress: 0,
              progressBarColor: "#ff0000", // Default to red for no progress
              status,
              index: idx + 1, // Add 1 to use index if no assignees starting from 1
            };
          })
        );
        const flattenedProjects = updatedProjects.flat(); // Flatten the array of arrays
        setProjectsData(flattenedProjects);
      };

      fetchTasksAndUpdateProjects();
    }
  }, [data, isFetching, userInfo]);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Portfolio" />

      <GridComponent
        dataSource={projectsData?.map((project, index) => ({
          ...project,
          index: index + 1,
        }))}
        enableHover={false}
        allowPaging
        pageSettings={{ pageCount: 5 }}
        selectionSettings={selectionSettings}
        rowSelected={onRowSelected}
        rowDeselected={onRowDeselected}
        toolbar={toolbarOptions}
        editSettings={editing}
        allowSorting
        toolbarClick={handleToolbarClick}
        selectAll={handleSelectAll}
        clearSelection={handleClearSelection}
      >
        <ColumnsDirective>
          {/* Custom column for Progress */}
          <ColumnDirective />
          {/* Other columns */}
          {customersGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter]} />
      </GridComponent>
    </div>
  );
};

export default Portfolio;
