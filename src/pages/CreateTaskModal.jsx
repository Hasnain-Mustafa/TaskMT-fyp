import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, setSeconds } from 'date-fns';

const CreateTaskModal = ({updateTasks}) => {
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    id: 0,
    Title: '',
    Status: 'Open',
    Summary: '',
    type: 'Bug',
    priority: 'High',
    tags: '',
    assignee: '',
    rankId: '',
    color: '',
    className: '',
    dueDate: null,
    startDate: format(setSeconds(new Date(), 0), "yyyy-MM-dd'T'HH:mm:ss'Z'", { timeZone: 'UTC' }), // Set seconds to 0
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (field) => (event) => {
  
      setNewTask({ ...newTask, [field]: event.target.value });
    
  };
  

  const handleCreateTask = () => {
   
    fetch("http://localhost:8001/kanbanData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((res) => {
        updateTasks(newTask)
        console.log(newTask)
     
      })
      .catch((err) => {
        console.log(err.message);
      });

    // Close the modal
    handleClose();
    
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen} style={{ marginLeft: '10px' }}>
        New Task
      </Button>

      <Drawer anchor="right" open={open} onClose={handleClose}>
        <Box p={2} width={800}>
          <Typography variant="h6">Create New Task</Typography>
          <Grid container spacing={3}>
            {[
             
              { label: 'Title', id: 'Title' },
              { label: 'Summary', id: 'Summary' },
              { label: 'Tags', id: 'tags' },
              { label: 'Assignee', id: 'assignee' },
              { label: 'Rank ID', id: 'rankId' },
              { label: 'Color', id: 'color' },
              { label: 'Class Name', id: 'className' },
            ].map((field) => (
              <Grid item xs={12} sm={4} key={field.id}>
                <TextField
                  id={field.id}
                  variant="outlined"
                  label={field.label}
                  fullWidth
                  value={newTask[field.id]}
                  onChange={handleInputChange(field.id)}
                />
              </Grid>
            ))}
            <Grid item xs={12} sm={4}>
              <Select
                id="Status"
                variant="outlined"
                label="Status"
                value={newTask.Status}
                onChange={handleInputChange('Status')}
                fullWidth
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="InProgress">InProgress</MenuItem>
                <MenuItem value="Testing">Testing</MenuItem>
                <MenuItem value="Close">Close</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Select
                id="type"
                variant="outlined"
                label="Type"
                value={newTask.type}
                onChange={handleInputChange('type')}
                fullWidth
              >
                <MenuItem value="Bug">Bug</MenuItem>
                <MenuItem value="Feature">Feature</MenuItem>
                <MenuItem value="Enhancement">Enhancement</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Select
                id="priority"
                variant="outlined"
                label="Priority"
                value={newTask.priority}
                onChange={handleInputChange('priority')}
                fullWidth
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={4}>
              {/* Date Picker */}
              <DatePicker
  id="dueDate"
  selected={newTask.dueDate ? new Date(newTask.dueDate) : null}
  onChange={(date) =>
    setNewTask({
      ...newTask,
      dueDate: date ? format(setSeconds(date, 0), "yyyy-MM-dd'T'HH:mm:ss'Z'", { timeZone: 'UTC' }): null,
 
  })}
  showTimeSelect
  timeIntervals={15}
  dateFormat="MM/dd/yyyy h:mm aa"
/>





            </Grid>
          </Grid>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button type="submit" variant="contained" onClick={handleCreateTask}>
              Create Task
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};

export default CreateTaskModal;
