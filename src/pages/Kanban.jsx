import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { KanbanComponent, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-kanban';
import { Header } from '../components';
import { kanbanGrid } from '../data/dummy';
import CreateTaskModal from './CreateTaskModal';
import Avatar from '@mui/material/Avatar';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import avatar from '../data/avatar.jpg';
import { useStateContext } from '../contexts/ContextProvider';

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
  const [tasks, setTasks] = useState([]);

  const updateTasks = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  useEffect(() => {
    fetch("http://localhost:8001/kanbanData")
      .then((res) => res.json())
      .then((resp) => {
       
        setTasks(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  let fields = [
    { key: 'Title', type: 'TextBox' },
    { key: 'Status', type: 'DropDown' },
    { key: 'Summary', type: 'TextArea' }
  ];

  const onActionBegin = (args) => {
    if (args.requestType === 'cardChange') {
      const changedTask = args.changedRecords[0];
      const targetColumnKey = changedTask.status;
  
      // Update only the task whose status has changed
      const updatedTasks = tasks.map((task) =>
        task.id === changedTask.id ? { ...task, status: targetColumnKey } : task
      );
  
      // Update the state with the new tasks
      setTasks(updatedTasks);
  
      // Send the updated task to the server
      fetch(`http://localhost:8001/kanbanData/${changedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...changedTask, status: targetColumnKey }), // Send the updated task with the changed status
      })
        .then((res) => res.json())
        .then((response) => console.log(response))
        .catch((error) => console.error('Error updating task:', error));
    }
  };

  const onActionComplete = (args) => {
    console.log(args)
    if (args.requestType === 'save' && args.action === 'CardChanged') {
      const changedTask = args.data[0]; // Assuming that only one task is changed at a time

      // Update the state with the new tasks
      const updatedTasks = tasks.map((task) =>
        task.id === changedTask.id ? { ...task, status: changedTask.Status } : task
      );
      setTasks(updatedTasks);
console.log(tasks)
      // Send the updated task to the server
      fetch(`http://localhost:8001/kanbanData/${changedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...changedTask }), // Send the updated task
      })
        .then((res) => res.json())
        .then((response) => console.log(response))
        .catch((error) => console.error('Error updating task:', error));
    }else if(
      args &&
      args.requestType === 'cardRemoved' &&
      args.deletedRecords &&
      args.deletedRecords.length > 0
    ){
      console.log(args)
      const deletedTask = args.deletedRecords[0] // Assuming that only one task is deleted at a time
  console.log(deletedTask)
      // Update the state by removing the deleted task
      const updatedTasks = tasks.filter((task) => task.id !== deletedTask.id);
      setTasks(updatedTasks);
  
      // Send the delete request to the server
      fetch(`http://localhost:8001/kanbanData/${deletedTask.id}`, {
        method: 'DELETE',
      })
        .then((res) => res.json())
        .then((response) => console.log(response))
        .catch((error) => console.error('Error deleting task:', error));
    

    }
  };
  
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl">
      <Header title="Tasks" />

      <CreateTaskModal updateTasks={updateTasks}/>
      <KanbanComponent
        id="kanban"
        keyField="Status"
        dataSource={tasks}
        cardSettings={{
          contentField: "Summary",
          headerField: "id",
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
         
        }}actionBegin={onActionBegin}
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
    </div>
  );
};

export default Kanban;