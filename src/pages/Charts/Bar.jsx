import React, { useEffect } from "react";
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  Legend,
  Category,
  Tooltip,
  ColumnSeries,
  DataLabel,
} from "@syncfusion/ej2-react-charts";
import Typography from "@mui/material/Typography";
import {
  useGetAllAssignedTasksByIdQuery,
  useGetAllCreatedTasksByIdQuery,
} from "../../app/services/tasks/tasksService";
import { setBarData } from "../../features/tasks/taskSlice";
import { useSelector, useDispatch } from "react-redux";
import { gql } from "@apollo/client";
import client from "../../ApolloClient";
import { ChartsHeader } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";

const Bar = () => {
  const { currentMode } = useStateContext();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { barData } = useSelector((state) => state.tasks);

  const barPrimaryXAxis = {
    valueType: "Category",
    interval: 1,
    majorGridLines: { width: 0 },
  };
  const barPrimaryYAxis = {
    majorGridLines: { width: 0 },
    majorTickLines: { width: 0 },
    lineStyle: { width: 0 },
    labelStyle: { color: "transparent" },
  };

  const {
    data: tasksData,
    isFetching,
    refetch,
  } = userInfo.isManager === "true"
    ? useGetAllCreatedTasksByIdQuery({
        taskCreatorId: userInfo.id,
      })
    : useGetAllAssignedTasksByIdQuery({
        taskAssigneeId: userInfo.id,
      });

  useEffect(() => {
    const timer = setTimeout(() => {
      refetch(); // Refetching data after a 2-second delay
    }, 2000);

    return () => clearTimeout(timer); // Clean up the timer if the component unmounts
  }, [refetch]);

  useEffect(() => {
    const actionPayload =
      userInfo.isManager === "true"
        ? tasksData?.getAllCreatedTasksById
        : tasksData?.getAllAssignedTasksById;

    if (tasksData && !isFetching && actionPayload) {
      const fetchMemberDetailsAndFormatTasks = async () => {
        const statusMap = new Map();

        await Promise.all(
          actionPayload.map(async (task) => {
            const member = await fetchMemberName(task.taskAssigneeId);
            if (member) {
              if (!statusMap.has(member.name)) {
                statusMap.set(member.name, {
                  Open: 0,
                  InProgress: 0,
                  Close: 0,
                });
              }
              const counts = statusMap.get(member.name);
              if (task.Status === "Open") counts.Open += 1;
              if (task.Status === "InProgress") counts.InProgress += 1;
              if (task.Status === "Close") counts.Close += 1;
              statusMap.set(member.name, counts);
            }
          })
        );

        const toDoTasks = [];
        const inProgressTasks = [];
        const completedTasks = [];

        statusMap.forEach((value, key) => {
          toDoTasks.push({ x: key, y: value.Open });
          inProgressTasks.push({ x: key, y: value.InProgress });
          completedTasks.push({ x: key, y: value.Close });
        });

        dispatch(setBarData([toDoTasks, inProgressTasks, completedTasks]));
      };

      fetchMemberDetailsAndFormatTasks();
    }
  }, [tasksData, isFetching, dispatch]);

  const fetchMemberName = async (memberId) => {
    const { data, error } = await client.query({
      query: gql`
        query GetMemberById($userId: String!) {
          getMemberById(userId: $userId) {
            id
            email
            name
            isManager
            assignedProjectIds
          }
        }
      `,
      variables: { userId: memberId },
    });
    if (error) {
      console.error("Error fetching member details:", error);
      return null;
    }
    return data.getMemberById;
  };

  const barCustomSeries = [
    {
      dataSource: barData[0],
      xName: "x",
      yName: "y",
      name: "To-do",
      type: "Column",
      marker: {
        dataLabel: {
          visible: true,
          position: "Top",
          font: { fontWeight: "600", color: "#ffffff" },
        },
      },
    },
    {
      dataSource: barData[1],
      xName: "x",
      yName: "y",
      name: "In-progress",
      type: "Column",
      marker: {
        dataLabel: {
          visible: true,
          position: "Top",
          font: { fontWeight: "600", color: "#ffffff" },
        },
      },
    },
    {
      dataSource: barData[2],
      xName: "x",
      yName: "y",
      name: "Completed",
      type: "Column",
      marker: {
        dataLabel: {
          visible: true,
          position: "Top",
          font: { fontWeight: "600", color: "#ffffff" },
        },
      },
    },
  ];

  const hasData = barData && barData.some((data) => data.length > 0);

  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <ChartsHeader category="Bar" title="Task Status Counts by Assignee" />
      <div className="w-full">
        {hasData ? (
          <div
            className="chart-container lg:w-[40rem] xl:w-full"
            style={{
              overflowX: "auto",
              // width: "100%",
              whiteSpace: "nowrap",
            }}
          >
            <div
              style={{
                minWidth: "1024px",
                display: "inline-block",
              }}
            >
              <ChartComponent
                id="charts"
                primaryXAxis={barPrimaryXAxis}
                primaryYAxis={barPrimaryYAxis}
                chartArea={{ border: { width: 0 } }}
                tooltip={{ enable: true }}
                background={currentMode === "Dark" ? "#33373E" : "#fff"}
                legendSettings={{ background: "white" }}
              >
                <Inject
                  services={[
                    ColumnSeries,
                    Legend,
                    Tooltip,
                    Category,
                    DataLabel,
                  ]}
                />
                <SeriesCollectionDirective>
                  {barCustomSeries.map((item, index) => (
                    <SeriesDirective key={index} {...item} />
                  ))}
                </SeriesCollectionDirective>
              </ChartComponent>
            </div>
          </div>
        ) : (
          <Typography
            variant="h6"
            style={{ textAlign: "center", marginTop: "20px", color: "#999" }}
          >
            No data to display
          </Typography>
        )}
      </div>
    </div>
  );
};

export default Bar;
