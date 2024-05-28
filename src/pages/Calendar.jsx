import React, { useState, useEffect } from "react";
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  ResourcesDirective,
  ResourceDirective,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";
import {
  useGetAssignedTasksByIdQuery,
  useGetCreatedTasksByIdQuery,
} from "../app/services/tasks/tasksService";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { Header } from "../components";
import { setCalendarData } from "../features/tasks/taskSlice";
import { useSelector, useDispatch } from "react-redux";
import getStatusColor from "../utils/utils";
import { gql } from "@apollo/client";
import client from "../ApolloClient";
const PropertyPane = (props) => <div className="mt-5">{props.children}</div>;

const Calendar = () => {
  const [scheduleObj, setScheduleObj] = useState();
  const dispatch = useDispatch();
  const { calendarData } = useSelector((state) => state.tasks);
  const { userInfo } = useSelector((state) => state.auth);
  const change = (args) => {
    scheduleObj.selectedDate = args.value;
    scheduleObj.dataBind();
  };

  // const onDragStart = (arg) => {
  //   arg.navigation.enable = true;
  // };

  const { data: tasksData, isFetching } =
    userInfo.isManager == "true"
      ? useGetCreatedTasksByIdQuery(
          {
            taskCreatorId: userInfo.id,
          },
          {
            refetchOnMountOrArgChange: true,
            skip: false,
            selectFromResult: (data) => data,
          }
        )
      : useGetAssignedTasksByIdQuery(
          {
            taskAssigneeId: userInfo.id,
          },
          {
            refetchOnMountOrArgChange: true,
            skip: false,
            selectFromResult: (data) => data,
          }
        );
  useEffect(() => {
    const actionPayload =
      userInfo.isManager == "true"
        ? tasksData?.getCreatedTasksById
        : tasksData?.getAssignedTasksById;

    if (tasksData && !isFetching && actionPayload) {
      const fetchMemberDetailsAndFormatTasks = async () => {
        const tasksWithDetails = await Promise.all(
          actionPayload.map(async (task) => {
            const member = await fetchMemberName(task.taskAssigneeId); // fetchMemberName needs to be implemented
            return {
              Id: task.id,
              Subject: task.Title,
              Description: task.Summary,
              StartTime: task.startDate,
              EndTime: task.dueDate,
              Member: member.name, // assuming the fetched member object has a name property
              Color: getStatusColor(task.Status),
            };
          })
        );
        console.log(tasksWithDetails);
        dispatch(setCalendarData(tasksWithDetails));
      };

      fetchMemberDetailsAndFormatTasks();
    }
  }, [tasksData, isFetching, dispatch]);

  // Assuming fetchMemberName is a function that fetches the member details based on id
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
  const onPopupOpen = (args) => {
    if (args.type === "Editor" || args.type === "Add") {
      args.cancel = true; // Prevent the editor from opening when clicking on an empty cell
    }
    if (args.type === "QuickInfo") {
      // Use a timeout to ensure the DOM is fully loaded before attempting to modify it
      setTimeout(() => {
        const deleteButton = document.querySelector(
          ".e-delete.e-control.e-btn.e-lib.e-flat.e-round.e-small.e-icon-btn"
        );
        if (deleteButton) {
          deleteButton.remove(); // Removes the delete button from the DOM entirely
        }
      }, 10);
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="App" title="Calendar" />
      <ScheduleComponent
        height="650px"
        popupOpen={onPopupOpen}
        ref={(schedule) => setScheduleObj(schedule)}
        selectedDate={new Date()}
        eventSettings={{ dataSource: calendarData }}
        // dragStart={onDragStart}
      >
        <ViewsDirective>
          {["Day", "Week", "WorkWeek", "Month", "Agenda"].map((item) => (
            <ViewDirective key={item} option={item} />
          ))}
        </ViewsDirective>
        <ResourcesDirective>
          <ResourceDirective
            field="Id"
            title="Member"
            name="Resources"
            textField="Member"
            idField="Id"
            colorField="Color"
            dataSource={calendarData}
          ></ResourceDirective>
        </ResourcesDirective>
        <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize]} />
      </ScheduleComponent>
      <PropertyPane>
        <table style={{ width: "100%", background: "white" }}>
          <tbody>
            <tr style={{ height: "50px" }}>
              <td style={{ width: "100%" }}>
                <DatePickerComponent
                  value={new Date()}
                  showClearButton={false}
                  placeholder="Current Date"
                  floatLabelType="Always"
                  change={change}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </PropertyPane>
    </div>
  );
};

export default Calendar;
