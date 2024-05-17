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
import avatar2 from "../data/avatar2.jpg";

import "react-circular-progressbar/dist/styles.css"; // Importing styles for progress bar
import { useSelector, useDispatch } from "react-redux";

import { Header } from "../components";

import {
  fetchProjectTasks,
  deleteProject,
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
    allowEditing: true,
  };

  const [selectedRowsData, setSelectedRowsData] = useState([]);

  const { data, isFetching } =
    userInfo.isManager == "true"
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
    // Assuming args contains all rows or a way to fetch all row data
    const allProjectIds = projectsData.map((project) => project.id); // Extract IDs or relevant data
    setSelectedRowsData(allProjectIds);
  };

  const handleClearSelection = () => {
    setSelectedRowsData([]); // Clear all selections
  };

  const onRowSelected = (args) => {
    console.log("Selected rows:", args?.data);
    if (Array.isArray(args?.data)) {
      // When args.data is an array, add all selected IDs
      const selectedIds = args.data.map((item) => item.id); // Assuming 'id' is the identifier
      setSelectedRowsData(
        (prevSelectedRowsData) => [
          ...new Set([...prevSelectedRowsData, ...selectedIds]),
        ] // Use Set to avoid duplicates
      );
    } else {
      // Single item selection (fallback)
      const selectedId = args?.data?.id;
      setSelectedRowsData(
        (prevSelectedRowsData) => [
          ...new Set([...prevSelectedRowsData, selectedId]),
        ] // Use Set to avoid duplicates
      );
    }
  };

  const onRowDeselected = (args) => {
    console.log("Deselected rows:", args?.data);
    if (Array.isArray(args?.data)) {
      // When args.data is an array, remove all deselected IDs
      const deselectedIds = args.data.map((item) => item.id); // Assuming 'id' is the identifier
      setSelectedRowsData((prevSelectedRowsData) =>
        prevSelectedRowsData.filter((id) => !deselectedIds.includes(id))
      );
    } else {
      // Single item deselection (fallback)
      const deselectedId = args?.data?.id;
      setSelectedRowsData((prevSelectedRowsData) =>
        prevSelectedRowsData.filter((id) => id !== deselectedId)
      );
    }
  };

  // const handleToolbarClick = (args) => {
  //   console.log(args);

  //   // Dispatch an action to delete multiple projects
  //   dispatch(deleteProject({ projectIds: selectedRowsData })); // assuming deleteProject action takes an object with an array of IDs
  //   console.log(`Deleted projects with IDs: ${selectedRowsData.join(", ")}`);
  //   setSelectedRowsData([]); // Clear the selection after deleting
  // };

  // const handleToolbarClick = (args) => {
  //   console.log(args);

  //   selectedRowsData.forEach((projectId) => {
  //     dispatch(deleteProject({ projectId })); // Dispatch an action to delete the project
  //   });
  //   console.log(`Deleted projects with IDs: ${selectedRowsData.join(", ")}`);
  //   setSelectedRowsData([]); // Clear the selection after deleting
  // };
  const handleToolbarClick = (args) => {
    console.log(args);
    console.log(selectedRowsData);
    // Dispatch a single action to delete all selected projects at once
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
    console.log(props);
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
  const customerGridImage = (props) => (
    <div className="image flex gap-4 items-center">
      <img className="rounded-full w-10 h-10" src={avatar2} alt="employee" />
      <div>
        {props?.assigneeDetails?.map((assignee, index) => (
          <React.Fragment key={index}>
            <p>{assignee?.name}</p>
            <p>{assignee?.email}</p>
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  // const customersGrid = [
  //   { type: "checkbox", width: "50" },
  //   {
  //     field: "index",
  //     headerText: "ID",
  //     width: "150",
  //     textAlign: "Center",
  //     isPrimaryKey: true,
  //   },
  //   {
  //     field: "name",
  //     headerText: "Name",
  //     width: "200",
  //     template: customerGridImage,
  //     textAlign: "Center",
  //   },
  //   {
  //     field: "title",
  //     headerText: "Project Name",
  //     width: "150",
  //     textAlign: "Center",
  //   },
  //   {
  //     field: "status",
  //     headerText: "Status",
  //     width: "130",
  //     format: "yMd",
  //     textAlign: "Center",
  //     template: customerGridStatus,
  //   },
  //   {
  //     field: "weeks",
  //     headerText: "Weeks",
  //     width: "100",
  //     format: "C2",
  //     textAlign: "Center",
  //   },
  //   {
  //     field: "budget",
  //     headerText: "Budget",
  //     width: "100",
  //     format: "yMd",
  //     textAlign: "Center",
  //   },
  //   {
  //     field: "Progress",
  //     headerText: "Progress",
  //     width: "120",
  //     template: renderProgress,
  //     textAlign: "Center",
  //   },
  // ];

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
    console.log(selectedRowsData);
  }, [selectedRowsData]);
  useEffect(() => {
    if (data && !isFetching) {
      const actionPayload =
        userInfo.isManager == "true"
          ? data?.getAllProjects
          : data?.getAllProjectsAssigned;
      const fetchTasksAndUpdateProjects = async () => {
        const updatedProjects = await Promise.all(
          actionPayload.map(async (project) => {
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

              // Determine status based on progress
              if (progress === 100) {
                status = "Completed";
              } else if (progress > 0) {
                status = "Active";
              }

              return {
                ...project,
                Progress: progress,
                progressBarColor,
                status,
              };
            } else {
              return {
                ...project,
                Progress: 0,
                progressBarColor: "#ff0000",
                status,
              };
            }
          })
        );

        setProjectsData(updatedProjects);
      };

      fetchTasksAndUpdateProjects();
    }
  }, [data, isFetching]);

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
