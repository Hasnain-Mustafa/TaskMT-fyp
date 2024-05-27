import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import CreateTaskModal from "./CreateTaskModal";
import Avatar from "@mui/material/Avatar";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import avatar from "../data/avatar.jpg";
import { useStateContext } from "../contexts/ContextProvider";
import { updateTasks } from "../features/tasks/taskSlice";
import { getCurrentFormattedTime } from "../utils/utils";
import SimpleModal from "../components/SimpleModal";
import { updateTask, deleteTask } from "../features/tasks/taskActions";
import {
  useGetAssignedTasksQuery,
  useGetCreatedTasksQuery,
} from "../app/services/tasks/tasksService";
import { pushNotifications } from "../features/auth/authActions";
import taskComplete from "../data/taskComplete.json";

const getStatusColor = (status) => {
  switch (status) {
    case "Open":
      return "red";
    case "InProgress":
      return "pink";
    case "Review":
      return "yellow";
    case "Close":
      return "green";
    default:
      return "black";
  }
};

const kanbanGrid = [
  { headerText: "To Do", keyField: "Open" },

  { headerText: "In Progress", keyField: "InProgress" },
  {
    headerText: "Review",
    keyField: "Review",
    isExpanded: false,
  },
  {
    headerText: "Done",
    keyField: "Close",
  },
];

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
    const changedTask = args.changedRecords[0];

    if (userInfo.isManager !== "true" && changedTask.Status === "Close") {
      toast.error("Only project managers can set the status to 'Close'");
      args.cancel = true;
      return;
    } else {
    }

    if (
      args.requestType === "cardChange" &&
      changedTask.Status === "Review" &&
      userInfo.isManager !== "true"
    ) {
      if (changedTask) {
        const updatedTask = {
          ...changedTask,
          status: changedTask.Status,
          taskId: changedTask.id,
          title: changedTask.Title,
          summary: changedTask.Summary,
          turnedInAt: new Date().toISOString().slice(0, 19),
        };
        debouncedUpdateTask(updatedTask);
        setShowModal(true);
        dispatch(
          pushNotifications({
            userId: changedTask.taskCreatorId,
            notification: [
              {
                image: avatar,
                message: `${userInfo.name} submitted for review`,
                desc: "Assign new tasks",
                time: getCurrentFormattedTime(),
              },
            ],
          })
        );
      }
    } else {
      if (changedTask && changedTask.Status === "Review") {
        const updatedTask = {
          ...changedTask,
          status: changedTask.Status,
          taskId: changedTask.id,
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
            taskId: changedTask.id,
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
    if (userInfo.isManager !== "true" && event.data[0].Status == "Close") {
      event.cancel = true;
      toast.error(
        "Non-managers cannot move tasks that are marked as complete."
      );
      return;
    }
  };

  const onActionComplete = (args) => {
    if (args.requestType === "cardChanged" && name === "actionComplete") {
      const changedTask = args?.changedRecords[0];
      if (changedTask) {
        const updatedTask = {
          ...changedTask,
          status: changedTask.Status,
          taskId: changedTask.id,
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

      if (deletedTask && deletedTask.id) {
        const targetColumnKey = deletedTask.Status;

        args.cancel = true;
        toast.error("Only project manager can delete the task");

        const updatedTask = {
          ...deletedTask,
          taskId: deletedTask.id,
          status: targetColumnKey,
        };

        dispatch(updateTask(updatedTask));
      }
    } else {
      const deletedTask = args?.deletedRecords[0];

      if (deletedTask && deletedTask.id) {
        dispatch(deleteTask({ taskId: deletedTask.id }));
      }
    }
  };

  const cardTemplate = (data) => {
    const isManager = userInfo.isManager === "true";
    const isClosed = data.Status === "Close";

    const cardStyle = {
      pointerEvents: !isManager && isClosed ? "none" : "auto",
      opacity: !isManager && isClosed ? 0.6 : 1,
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
            {data.priority}
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
              src={data.assigneeURL.photoURL}
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
    <div className="m-2 lg:m-10 mt-24 p-2 lg:p-10 rounded-3xl">
      <Header title="Tasks" />
      <div className="kanban-wrapper">
        <CreateTaskModal />
        {tasks && tasks.length > 0 ? (
          <div className="kanban-container">
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
          </div>
        ) : (
          <Typography
            variant="h6"
            style={{
              textAlign: "center",
              marginTop: "40px",
              color: "#4a4a4a",
              fontSize: "18px",
              fontWeight: "500",
              padding: "20px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            The board is clean!
          </Typography>
        )}
        <SimpleModal isOpen={showModal} onClose={() => setShowModal(false)}>
          <LottieAnimation animationPath={taskComplete} isVisible={showModal} />
        </SimpleModal>
      </div>
    </div>
  );
};

export default Kanban;
