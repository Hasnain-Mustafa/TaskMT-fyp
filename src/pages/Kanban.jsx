import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { KanbanComponent, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-kanban';
import { Header } from '../components';
import { useSelector, useDispatch } from 'react-redux';
import { kanbanGrid } from '../data/dummy';
import CreateTaskModal from './CreateTaskModal';
import Avatar from '@mui/material/Avatar';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import avatar from '../data/avatar.jpg';
import { useStateContext } from '../contexts/ContextProvider';
import { setCredentials  } from '../features/tasks/taskSlice'
import { updateTask, deleteTask } from '../features/tasks/taskActions';
import { useGetAssignedTasksQuery} from '../app/services/tasks/tasksService'
import { Snackbar, Button } from '@mui/material';
const getStatusColor = (status) => {
  switch (status) {
    case 'Open':
      return 'red';
    case 'InProgress':
      return 'pink';
    case 'Testing':
      return 'yellow';
    case 'Close':
      return 'green';
    default:
      return 'black';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return 'red';
    case 'Medium':
      return 'yellow';
    case 'Low':
      return 'green';
    default:
      return 'black';
  }
};

const UserAvatar = () => (
  <Avatar alt="Assignee" src="../data/avatar.jpg" />
);

const ColoredCircle = ({ color }) => (
  <FiberManualRecordIcon fontSize="small" style={{ color, verticalAlign: 'middle' }} />
);

const Kanban = () => {
  const { currentColor } = useStateContext();
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const { userInfo} = useSelector((state) => state.auth);
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const { data : tasksData, isFetching} = useGetAssignedTasksQuery({ projectId: "660b041a439272a58ead3b54", taskAssigneeId : userInfo.id });
 // const updateTasks = (newTask) => {
  //   setTasks([...tasks, newTask]);
  // };
  useEffect(() => {
    if (tasksData) {
      dispatch(setCredentials(tasksData?.getAssignedTasks));
    }
  }, [tasksData, dispatch]);
  const onActionBegin = (args) => {
    if (args.requestType === 'cardChange' && args.changedRecords && args.changedRecords.length > 0) {
      const changedTask = args.changedRecords[0];
      const targetColumnKey = changedTask.Status;
  
       // Check if the user is a manager and the target status is 'Close'
    if (!userInfo.isManager && targetColumnKey === 'Close') {
      // Prevent changing the status to 'Close'
      args.cancel = true;
          // Show the popup
          togglePopup();
      return;
    }
      // Create a new task object with the updated status
      const updatedTask = {
        ...changedTask,
        status: targetColumnKey,
        taskId: changedTask.id,
        title: changedTask.Title,
       summary: changedTask.Summary
        
      };
 
      // Dispatch the action to update the task
      dispatch(updateTask(updatedTask));
    }
  };
  

  
 

  const onActionComplete = (args) => {
    console.log(args)
    if (args.requestType === 'cardChanged' && name === 'actionComplete') {
      const changedTask = args.changedRecords[0]; // Assuming that only one task is changed at a time

      const updatedTask = {
        ...changedTask,
        status: changedTask.Status,
        taskId: changedTask.id,
        title: changedTask.Title,
       summary: changedTask.Summary
        
      };
 
      // Dispatch the action to update the task
      dispatch(updateTask(updatedTask)); 
    }
    
 
  else if(
      args &&
      args.requestType === 'cardRemoved' &&
      args.deletedRecords &&
      args.deletedRecords.length > 0
    ){
    
      const deletedTask = args.deletedRecords[0] // Assuming that only one task is deleted at a time
      dispatch(deleteTask({ taskId: deletedTask.id }));
  
     
  }};

  let fields = [
    { key: 'Title', type: 'TextBox' },
    { key: 'Status', type: 'DropDown' },
    { key: 'Summary', type: 'TextArea' }
  ];

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl">
      <Header title="Tasks" />
      <Snackbar
  open={showPopup}
  autoHideDuration={6000}
  onClose={togglePopup}
  message="Only project manager can mark this task as complete"
  action={
    <Button color="primary" size="small" onClick={togglePopup}>
      Close
    </Button>
  }
/>
      <CreateTaskModal/>
      {tasks && tasks.length > 0 && (
        <KanbanComponent
          id="kanban"
          keyField="Status"
          dataSource={tasks.map(task => ({ ...task, uniqueId: `${task.id}-${task.Status}` }))}
          cardSettings={{
            contentField: "Summary",
            headerField: "uniqueId",
            template: (data) => (
              <div>
                <div>
                  <Typography variant="h8" style={{ fontWeight: 'bold' }}>{data.Title}</Typography>
                  <Typography variant="subtitle1">{data.Summary}</Typography>
                </div>
                <div>
                  <ColoredCircle color={getPriorityColor(data.priority)} />
                  <Typography variant="body2" style={{ display: 'inline', marginLeft: '4px', marginRight: '8px' }}>
                    {data.priority}
                  </Typography>
                  <ColoredCircle color={getStatusColor(data.Status)} />
                  <Typography variant="body2" style={{ display: 'inline', marginLeft: '4px' }}>
                    {data.Status}
                  </Typography>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                    <img className="rounded-full h-8 w-8" src={avatar} alt="user-profile" />
                    <div>
                      <Typography variant="body2" style={{ display: 'block', marginLeft: '4px' }}>
                         {data.startDate && new Date(data.startDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric'})}
  {' - '}
  {data.dueDate && new Date(data.dueDate).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'})}
  <br />
  {data.startDate && new Date(data.startDate).toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true })}
  {' - '}
  {data.dueDate && new Date(data.dueDate).toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true })}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            ),
          }}
          actionBegin={onActionBegin}
          actionComplete={onActionComplete}
          dialogSettings={{ fields: fields }}
          style={{ marginTop: '20px' }}
        >
          <ColumnsDirective >
            {kanbanGrid.map((item, index) => (
              <ColumnDirective key={index} {...item} />
            ))}
          </ColumnsDirective>
        </KanbanComponent>
      )}
    </div>
  );
};

export default Kanban;
