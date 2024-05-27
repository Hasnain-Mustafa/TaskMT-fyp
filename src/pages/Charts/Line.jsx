import React, { useEffect } from "react";
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  LineSeries,
  Category,
  Legend,
  Tooltip,
} from "@syncfusion/ej2-react-charts";
import { fetchProjectTasks } from "../../features/projects/projectActions";
import {
  useGetAllProjectsQuery,
  useGetAllProjectsAssignedQuery,
} from "../../app/services/projects/projectsService";
import { setLineChartData } from "../../features/tasks/taskSlice";
import { ChartsHeader } from "../../components";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

const Line = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { lineChartData } = useSelector((state) => state.tasks);
  const { data: projectsData, isFetching } =
    userInfo.isManager === "true"
      ? useGetAllProjectsQuery({ creatorId: userInfo.id })
      : useGetAllProjectsAssignedQuery({ assigneeId: userInfo.id });

  const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
    const date = moment().subtract(i, "days");
    return {
      dayName: date.format("ddd"), // Day of the week like 'Mon'
      dayDate: date.format("YYYY-MM-DD"), // Full date like '2024-05-11'
    };
  }).reverse();

  useEffect(() => {
    if (projectsData && !isFetching) {
      const actionPayload =
        userInfo.isManager === "true"
          ? projectsData.getAllProjects
          : projectsData.getAllProjectsAssigned;

      const calculateProgress = async () => {
        try {
          const projectsProgress = await Promise.all(
            actionPayload.map(async (project) => {
              if (
                project.assigneeDetails &&
                project.assigneeDetails.length > 0
              ) {
                const tasks = await Promise.all(
                  project.assigneeDetails.map((assignee) =>
                    fetchProjectTasks(project.id, assignee.id)
                  )
                ).then((results) => {
                  return results.flat();
                });

                const daysProgress = lastSevenDays.map(
                  ({ dayName, dayDate }) => {
                    // Splitting the formatted string to get the date part

                    const dayTasks = tasks.filter(
                      (task) =>
                        moment(task.turnedInAt).format("YYYY-MM-DD") === dayDate
                    );

                    const tasksToBeCompleted = tasks.filter(
                      (task) =>
                        task.Status === "Open" ||
                        task.Status === "InProgress" ||
                        moment(task.turnedInAt).format("YYYY-MM-DD") === dayDate
                    ).length;
                    const tasksCompleted = dayTasks.filter(
                      (task) =>
                        moment(task.turnedInAt).format("YYYY-MM-DD") === dayDate
                    ).length;
                    return tasksToBeCompleted > 0
                      ? (tasksCompleted / tasksToBeCompleted) * 100
                      : 0;
                  }
                );

                return {
                  name: project.title,
                  type: "Line",
                  dataSource: lastSevenDays.map(({ dayName }, index) => ({
                    x: dayName, // Use only the day name for the x-axis
                    y: daysProgress[index],
                  })),
                  xName: "x",
                  yName: "y",
                  marker: { visible: true, width: 10, height: 10 },
                };
              }
              return null;
            })
          );

          // Filter out null values if any projects didn't have assigneeDetails
          dispatch(setLineChartData(projectsProgress.filter(Boolean)));
        } catch (error) {
          console.error("Failed to calculate project progress:", error);
        }
      };

      calculateProgress();
    } else {
      console.log("No projects data available or still fetching data");
    }
  }, [projectsData, isFetching, dispatch, userInfo.isManager]);

  const hasData =
    lineChartData && lineChartData.some((data) => data.length > 0);

  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <ChartsHeader category="Line" title="Weekly Project Progress" />
      <div className="w-full overflow-x-auto whitespace-nowrap ">
        <div
          style={{
            minWidth: "1024px",
            display: "inline-block",
          }}
        >
          <ChartComponent
            id="line-chart"
            height="420px"
            primaryXAxis={{
              valueType: "Category",
              dataSource: lastSevenDays,
            }}
            primaryYAxis={{
              labelFormat: "{value}%",
              minimum: 0,
              maximum: 100,
              interval: 20,
            }}
            chartArea={{ border: { width: 0 } }}
            tooltip={{ enable: true }}
            background="white"
            legendSettings={{
              background: "white",
              textStyle: { color: "#000" },
            }}
          >
            <Inject services={[LineSeries, Category, Legend, Tooltip]} />
            <SeriesCollectionDirective>
              {lineChartData?.map((item, index) => (
                <SeriesDirective key={index} {...item} />
              ))}
            </SeriesCollectionDirective>
          </ChartComponent>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default Line;
