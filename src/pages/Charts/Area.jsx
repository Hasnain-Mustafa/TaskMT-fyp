import React, { useEffect } from "react";
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  SplineAreaSeries,
  Legend,
  Tooltip,
  DateTime,
} from "@syncfusion/ej2-react-charts";
import { fetchProjectTasks } from "../../features/projects/projectActions";
import { ChartsHeader } from "../../components";
import {
  useGetAllProjectsQuery,
  useGetAllProjectsAssignedQuery,
} from "../../app/services/projects/projectsService";
import { useSelector, useDispatch } from "react-redux";
import { setAreaChartData } from "../../features/tasks/taskSlice";
import moment from "moment";
import { gql } from "@apollo/client";
import client from "../../ApolloClient";

const Area = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { areaChartData } = useSelector((state) => state.tasks);

  const { data: projectsData, isFetching } =
    userInfo.isManager == "true"
      ? useGetAllProjectsQuery({ creatorId: userInfo.id })
      : useGetAllProjectsAssignedQuery({ assigneeId: userInfo.id });

  const tooltipRender = (args) => {
    // Ensures that the Y value is included in the tooltip content
    // Check that args.point and args.series are defined and have the correct properties
    if (
      args.point &&
      args.series &&
      args.point.y !== undefined &&
      args.series.name
    ) {
      args.text = `${
        args.series.name
      } - Date: ${args.point.x.toLocaleDateString()}, Tasks: ${args.point.y}`;
    } else {
      // Fallback text in case something is undefined
      args.text = "Data not available";
    }
  };

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

  useEffect(() => {
    if (projectsData && !isFetching) {
      const actionPayload =
        userInfo.isManager === "true"
          ? projectsData.getAllProjects
          : projectsData.getAllProjectsAssigned;

      const processData = async () => {
        const lastSevenDays = Array.from({ length: 7 }, (_, i) =>
          moment().subtract(i, "days").format("YYYY-MM-DD")
        ).reverse();

        try {
          const membersData = await Promise.all(
            actionPayload?.map(async (project) => {
              if (
                project.assigneeDetails &&
                project.assigneeDetails.length > 0
              ) {
                return await Promise.all(
                  project.assigneeDetails.map(async (assignee) => {
                    const tasks = await fetchProjectTasks(
                      project.id,
                      assignee.id
                    );
                    return tasks.map((task) => ({
                      ...task,
                      assigneeId: assignee.id,
                    }));
                  })
                );
              }
              return [];
            })
          );

          // Flatten tasks and map with member names
          const allTasks = membersData.flat(2);
          const tasksByMember = {};
          await Promise.all(
            allTasks?.map(async (task) => {
              if (task.turnedInAt) {
                const taskDate = moment(task.turnedInAt).format("YYYY-MM-DD");
                if (lastSevenDays.includes(taskDate)) {
                  const member = await fetchMemberName(task.assigneeId);
                  const memberName = member ? member.name : "Unknown";
                  if (!tasksByMember[memberName]) {
                    tasksByMember[memberName] = {};
                  }
                  tasksByMember[memberName][taskDate] =
                    (tasksByMember[memberName][taskDate] || 0) + 1;
                }
              }
            })
          );

          const chartData = Object.keys(tasksByMember).map((memberName) => ({
            name: memberName,
            dataSource: lastSevenDays.map((day) => ({
              x: day,
              y: tasksByMember[memberName][day] || 0,
            })),
            xName: "x",
            yName: "y",
            type: "SplineArea",
            opacity: "0.8",
            width: "2",
          }));

          dispatch(setAreaChartData(chartData));
        } catch (error) {
          console.error("Error processing project tasks:", error);
        }
      };

      processData();
    }
  }, [projectsData, isFetching, dispatch, userInfo.isManager]);

  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <ChartsHeader
        category="Area"
        title="Task Turn-In By Assignee Over Last 7 Days"
      />
      <div className="w-full lg:w-[40rem] xl:w-full overflow-x-auto whitespace-nowrap">
        <div
          style={{
            minWidth: "1024px",
            display: "inline-block",
          }}
        >
          <ChartComponent
            id="area-chart"
            primaryXAxis={{
              valueType: "DateTime",
              labelFormat: "dd/MMM",
              intervalType: "Days",
              edgeLabelPlacement: "Shift",
              labelStyle: { color: "gray" },
            }}
            primaryYAxis={{
              labelFormat: "{value}",
              title: "Completed Tasks",
              lineStyle: { width: 0 },
              maximum:
                Math.max(
                  ...areaChartData.map((series) =>
                    Math.max(...series.dataSource.map((data) => data.y))
                  )
                ) + 1,
              interval: 1,
              majorTickLines: { width: 0 },
              minorTickLines: { width: 0 },
              labelStyle: { color: "gray" },
            }}
            chartArea={{ border: { width: 0 } }}
            background="white"
            tooltip={{ enable: true, shared: true }}
            tooltipRender={tooltipRender}
            legendSettings={{ background: "white" }}
          >
            <Inject services={[SplineAreaSeries, DateTime, Legend, Tooltip]} />
            <SeriesCollectionDirective>
              {areaChartData.map((item, index) => (
                <SeriesDirective key={index} {...item} />
              ))}
            </SeriesCollectionDirective>
          </ChartComponent>
        </div>
      </div>
    </div>
  );
};

export default Area;
