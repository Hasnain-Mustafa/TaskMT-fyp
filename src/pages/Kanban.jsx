import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client"; // Import useQuery
import Typography from "@mui/material/Typography";
import LottieAnimation from "../components/LottieAnimation";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-kanban";
import { Header } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { kanbanGrid } from "../data/dummy";
import CreateTaskModal from "./CreateTaskModal";
import Avatar from "@mui/material/Avatar";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import avatar from "../data/avatar.jpg";
import { useStateContext } from "../contexts/ContextProvider";
import { reset, updateTasks } from "../features/tasks/taskSlice";
import { getCurrentFormattedTime } from "../utils/utils";
import SimpleModal from "../components/SimpleModal";
import {
  updateTask,
  deleteTask,
  getTasks,
} from "../features/tasks/taskActions";
import {
  useGetAssignedTasksQuery,
  useGetCreatedTasksQuery,
} from "../app/services/tasks/tasksService";
import { Snackbar, Button } from "@mui/material";
import { pushNotifications } from "../features/auth/authActions";
import taskComplete from "../data/taskComplete.json";
const getStatusColor = (status) => {
  switch (status) {
    case "Open":
      return "red";
    case "InProgress":
      return "pink";
    case "Testing":
      return "yellow";
    case "Close":
      return "green";
    default:
      return "black";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "red";
    case "Medium":
      return "yellow";
    case "Low":
      return "green";
    default:
      return "black";
  }
};

const UserAvatar = () => <Avatar alt="Assignee" src="../data/avatar.jpg" />;

const ColoredCircle = ({ color }) => (
  <FiberManualRecordIcon
    fontSize="small"
    style={{ color, verticalAlign: "middle" }}
  />
);

const Kanban = () => {
  const [showModal, setShowModal] = useState(false);

  const { currentColor } = useStateContext();
  const dispatch = useDispatch();
  const { tasks, displayTasks } = useSelector((state) => state.tasks);
  const { userInfo } = useSelector((state) => state.auth);
  const [showPopup, setShowPopup] = useState(false);
  const { projectId } = useParams();
  const [queryExecuted, setQueryExecuted] = useState(false);
  const [queryKey, setQueryKey] = useState(0); // State to track the key for query
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  // Call the useGetAssignedTasksQuery hook with the updated key
  const { data: tasksData, isFetching } =
    userInfo.isManager == "true"
      ? useGetCreatedTasksQuery(
          {
            projectId: projectId,
            taskCreatorId: userInfo.id,
          },
          {
            refetchOnMountOrArgChange: true,
            skip: false,
            selectFromResult: (data) => data,
          }
        )
      : useGetAssignedTasksQuery(
          {
            projectId: projectId,
            taskAssigneeId: userInfo.id,
          },
          {
            refetchOnMountOrArgChange: true,
            skip: false,
            selectFromResult: (data) => data,
          }
        );

  useEffect(() => {
    setQueryKey((prevKey) => prevKey + 1);
    const actionPayload =
      userInfo.isManager == "true"
        ? tasksData?.getCreatedTasks
        : tasksData?.getAssignedTasks;

    if (tasksData && !isFetching && actionPayload) {
      setTimeout(() => {
        dispatch(updateTasks(actionPayload));
      }, 250);
    }
  }, [tasksData, isFetching]);

  const debouncedUpdateTask = debounce(
    (task) => dispatch(updateTask(task)),
    0.01 // Debounce for 300ms
  );

  const onActionBegin = (args) => {
    console.log("Action Begin Event: ", args);

    // Assuming userInfo is defined somewhere in this scope
    const changedTask = args.changedRecords[0];

    if (userInfo.isManager !== "true" && changedTask.Status === "Close") {
      toast.error("Only project managers can set the status to 'Close'");
      args.cancel = true; // This prevents the save operation
      return; // Stop further processing
    } else {
    }

    // This block will handle cases where the task status is set to 'Testing' by non-managers
    if (
      args.requestType === "cardChange" &&
      changedTask.Status === "Testing" &&
      userInfo.isManager !== "true"
    ) {
      if (changedTask) {
        const updatedTask = {
          ...changedTask,
          status: changedTask.Status,
          taskId: changedTask.id, // Assuming 'id' is the correct property name
          title: changedTask.Title,
          summary: changedTask.Summary,
          turnedInAt: new Date().toISOString().slice(0, 19),
        };
        console.log(changedTask);
        debouncedUpdateTask(updatedTask);
        setShowModal(true);
        // Matches the 0.75s duration of the animation
        // Hide after 3 seconds
        // Correct usage of dispatch with an async thunk action creator
        dispatch(
          pushNotifications({
            userId: changedTask.taskCreatorId, // Assuming this is correctly obtaining the ID of the task creator
            notification: [
              {
                image: avatar, // Ensure this is the correct path or variable for the image
                message: `${userInfo.name} submitted for review`, // Correct string interpolation
                desc: "Assign new tasks",
                time: getCurrentFormattedTime(),
              },
            ],
          })
        );
      }
    } else {
      // This is the default block for updating tasks that do not meet specific conditions above
      if (changedTask && changedTask.Status === "Testing") {
        const updatedTask = {
          ...changedTask,
          status: changedTask.Status,
          taskId: changedTask.id, // Accessing id property safely
          title: changedTask.Title,
          summary: changedTask.Summary,
          turnedInAt: new Date().toISOString().slice(0, 19),
        };

        debouncedUpdateTask(updatedTask);
      } else {
        if (changedTask) {
          const updatedTask = {
            ...changedTask,
            status: changedTask.Status,
            taskId: changedTask.id, // Accessing id property safely
            title: changedTask.Title,
            summary: changedTask.Summary,
            turnedInAt: "",
          };

          debouncedUpdateTask(updatedTask);
        }
      }
    }
  };
  const onDialogOpen = (args) => {
    if (userInfo.isManager !== "true") {
      args.cancel = true;
    }
  };

  const onDragStart = (event) => {
    // Accessing the dragged card data
    if (userInfo.isManager !== "true" && event.data[0].Status == "Close") {
      event.cancel = true;
      toast.error(
        "Non-managers cannot move tasks that are marked as complete."
      );
      return;
    }
  };
  // const onDialogOpen = (args) => {
  //   console.log("Dialog is opening:", args); // Log or manipulate the dialog opening event
  //   if (userInfo.isManager != "true" && args.data.Status === "Close") {
  //     args.cancel = true; // Prevent editing if status is "Close" and user is not a manager
  //     toast.error("Only project manager can edit tasks marked as complete");
  //   }
  // };
  const onActionComplete = (args) => {
    console.log(args);

    if (args.requestType === "cardChanged" && name === "actionComplete") {
      const changedTask = args?.changedRecords[0];
      if (changedTask) {
        const updatedTask = {
          ...changedTask,
          status: changedTask.Status,
          taskId: changedTask.id, // Accessing id property safely
          title: changedTask.Title,
          summary: changedTask.Summary,
        };

        debouncedUpdateTask(updatedTask);
      }
    }
    if (
      userInfo.isManager !== "true" &&
      args.requestType === "cardRemoved" &&
      args &&
      args.deletedRecords &&
      args.deletedRecords.length > 0
    ) {
      const deletedTask = args.deletedRecords[0];

      // Check if the deletedTask exists and has an id
      if (deletedTask && deletedTask.id) {
        const targetColumnKey = deletedTask.Status;

        args.cancel = true;
        // Show the popup
        toast.error("Only project manager can delete the task");

        // Create a new task object with the updated status
        const updatedTask = {
          ...deletedTask,
          taskId: deletedTask.id,
          status: targetColumnKey,
        };

        // Dispatch the action to update the task
        dispatch(updateTask(updatedTask));
      }
    } else {
      const deletedTask = args?.deletedRecords[0];

      // Check if the deletedTask exists and has an id
      if (deletedTask && deletedTask.id) {
        // Dispatch the action to delete the task
        dispatch(deleteTask({ taskId: deletedTask.id }));
      }
    }
  };
  const cardTemplate = (data) => {
    const isManager = userInfo.isManager === "true";
    const isClosed = data.Status === "Close";

    const cardStyle = {
      pointerEvents: !isManager && isClosed ? "none" : "auto", // Disabling pointer events for non-managers on 'Close' status
      opacity: !isManager && isClosed ? 0.6 : 1, // Dimming the card to indicate it's disabled
    };

    return (
      <div style={cardStyle}>
        <div>
          <Typography variant="h8" style={{ fontWeight: "bold" }}>
            {data.Title}
          </Typography>
          <Typography variant="subtitle1">{data.Summary}</Typography>
        </div>
        <div>
          <ColoredCircle color={getPriorityColor(data.priority)} />
          <Typography
            variant="body2"
            style={{
              display: "inline",
              marginLeft: "4px",
              marginRight: "8px",
            }}
          >
            {data.Priority}
          </Typography>
          <ColoredCircle color={getStatusColor(data.Status)} />
          <Typography
            variant="body2"
            style={{ display: "inline", marginLeft: "4px" }}
          >
            {data.Status}
          </Typography>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "8px",
            }}
          >
            <img
              className="rounded-full h-8 w-8"
              src={avatar}
              alt="user-profile"
            />
            <div>
              <Typography
                variant="body2"
                style={{ display: "block", marginLeft: "4px" }}
              >
                {data.startDate &&
                  new Date(data.startDate).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })}
                {" - "}
                {data.dueDate &&
                  new Date(data.dueDate).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })}
                <br />
                {data.startDate &&
                  new Date(data.startDate).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                {" - "}
                {data.dueDate &&
                  new Date(data.dueDate).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    );
  };

  let fields = [
    { key: "index", type: "TextBox" },
    { key: "Title", type: "TextBox" },
    { key: "Status", type: "DropDown" },
    { key: "Summary", type: "TextArea" },
  ];

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl">
      <Header title="Tasks" />
      {/* <Snackbar
        open={showPopup}
        autoHideDuration={6000}
        onClose={togglePopup}
        message="Only project manager can mark this task as complete"
        action={
          <Button color="primary" size="small" onClick={togglePopup}>
            Close
          </Button>
        }
      /> */}
      <CreateTaskModal />
      {tasks && tasks.length > 0 && (
        <KanbanComponent
          id="kanban"
          keyField="Status"
          dataSource={tasks?.map((task, index) => ({
            ...task,
            index: index,
          }))}
          dragStart={onDragStart}
          cardSettings={{
            contentField: "Summary",
            headerField: "index",
            template: cardTemplate,
          }}
          actionComplete={onActionComplete}
          dialogSettings={{ fields: fields }}
          allowDragging={true}
          actionBegin={onActionBegin}
          dialogOpen={onDialogOpen}
          style={{ marginTop: "20px" }}
        >
          <ColumnsDirective>
            {kanbanGrid.map((item, index) => (
              <ColumnDirective key={index} {...item} />
            ))}
          </ColumnsDirective>
        </KanbanComponent>
      )}
      <SimpleModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      ></SimpleModal>
      <LottieAnimation animationPath={taskComplete} isVisible={showModal} />
    </div>
  );
};

export default Kanban;
