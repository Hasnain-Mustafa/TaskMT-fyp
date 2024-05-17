// import React, { useState } from "react";
// import Button from "@mui/material/Button";
// import Drawer from "@mui/material/Drawer";
// import Typography from "@mui/material/Typography";
// import { TextField } from "@mui/material";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
// import Box from "@mui/material/Box";
// import Grid from "@mui/material/Grid";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { format, setSeconds } from "date-fns";
// import { useSelector, useDispatch } from "react-redux";
// import { createTask } from "../features/tasks/taskActions";
// import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";

// const CreateTaskModal = () => {
//   const [open, setOpen] = useState(false);
//   const { userInfo } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const { projectId } = useParams();
//   const [newTask, setNewTask] = useState({
//     title: "",
//     status: "Open",
//     summary: "",
//     type: "Bug",
//     priority: "High",
//     taskAssigneeEmail: "",
//     dueDate: null,
//     startDate: format(setSeconds(new Date(), 0), "yyyy-MM-dd'T'HH:mm:ss'Z'", {
//       timeZone: "UTC",
//     }), // Set seconds to 0
//     projectId: projectId,
//     taskCreatorId: userInfo.id,
//   });

//   const handleOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleInputChange = (field) => (event) => {
//     const value = event.target.value;

//     setNewTask((prevState) => ({
//       ...prevState,
//       [field]: value,
//     }));
//   };

//   const handleCreateTask = () => {
//     const taskData = dispatch(createTask(newTask));
//     taskData.then((result) => {
//       console.log(result);
//       if (result && result.meta.requestStatus) {
//         console.log(result.meta.requestStatus);
//         if (result.meta.requestStatus === "rejected") {
//           toast.error(result.payload);
//         } else if (result.meta.requestStatus === "fulfilled") {
//           toast.success("Task Created");
//           handleClose();
//         }
//       }
//     });
//   };
//   return (
//     <div>
//       {userInfo.isManager === "true" && (
//         <Button
//           variant="outlined"
//           onClick={handleOpen}
//           style={{ marginLeft: "10px" }}
//         >
//           New Task
//         </Button>
//       )}
//       <Drawer anchor="right" open={open} onClose={handleClose}>
//         <Box p={2} width={800}>
//           <Typography variant="h6">Create New Task</Typography>
//           <Grid container spacing={3}>
//             {[
//               { label: "Title", id: "title" },
//               { label: "Summary", id: "summary" },
//               { label: "Assignee", id: "taskAssigneeEmail" },
//             ].map((field) => (
//               <Grid item xs={12} sm={4} key={field.id}>
//                 <TextField
//                   id={field.id}
//                   variant="outlined"
//                   label={field.label}
//                   fullWidth
//                   value={newTask[field.id]}
//                   onChange={handleInputChange(field.id)}
//                 />
//               </Grid>
//             ))}
//             <Grid item xs={12} sm={4}>
//               <Select
//                 id="Status"
//                 variant="outlined"
//                 label="Status"
//                 value={newTask.status}
//                 onChange={handleInputChange("status")}
//                 fullWidth
//               >
//                 <MenuItem value="Open">Open</MenuItem>
//                 <MenuItem value="InProgress">InProgress</MenuItem>
//                 <MenuItem value="Testing">Testing</MenuItem>
//                 <MenuItem value="Close">Close</MenuItem>
//               </Select>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <Select
//                 id="type"
//                 variant="outlined"
//                 label="Type"
//                 value={newTask.type}
//                 onChange={handleInputChange("type")}
//                 fullWidth
//               >
//                 <MenuItem value="Bug">Bug</MenuItem>
//                 <MenuItem value="Feature">Feature</MenuItem>
//                 <MenuItem value="Enhancement">Enhancement</MenuItem>
//               </Select>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <Select
//                 id="priority"
//                 variant="outlined"
//                 label="Priority"
//                 value={newTask.priority}
//                 onChange={handleInputChange("priority")}
//                 fullWidth
//               >
//                 <MenuItem value="High">High</MenuItem>
//                 <MenuItem value="Medium">Medium</MenuItem>
//                 <MenuItem value="Low">Low</MenuItem>
//               </Select>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <DatePicker
//                 id="dueDate"
//                 selected={newTask.dueDate ? new Date(newTask.dueDate) : null}
//                 onChange={(date) =>
//                   setNewTask({
//                     ...newTask,
//                     dueDate: date
//                       ? format(
//                           setSeconds(date, 0),
//                           "yyyy-MM-dd'T'HH:mm:ss'Z'",
//                           { timeZone: "PKT" }
//                         )
//                       : null,
//                   })
//                 }
//                 showTimeSelect
//                 timeIntervals={15}
//                 dateFormat="MM/dd/yyyy h:mm aa"
//               />
//             </Grid>
//           </Grid>
//           <Box mt={2} display="flex" justifyContent="space-between">
//             <Button
//               type="submit"
//               variant="contained"
//               onClick={handleCreateTask}
//             >
//               Create Task
//             </Button>
//             <Button variant="outlined" onClick={handleClose}>
//               Cancel
//             </Button>
//           </Box>
//         </Box>
//       </Drawer>
//     </div>
//   );
// };

// export default CreateTaskModal;
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import { TextField, Select, MenuItem, Box, Grid } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { createTask } from "../features/tasks/taskActions";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { framerButtonVariants } from "../components/framer";
import { useStateContext } from "../contexts/ContextProvider";
const CreateTaskModal = () => {
  const { currentColor } = useStateContext();
  const [open, setOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const [newTask, setNewTask] = useState({
    title: "",
    status: "Open",
    summary: "",
    type: "Bug",
    priority: "High",
    taskAssigneeEmail: "",
    dueDate: null,
    startDate: new Date(), // Start date in local timezone
    projectId: projectId,
    taskCreatorId: userInfo.id,
    turnedInAt: "",
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setNewTask((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleDateChange = (date) => {
    setNewTask({
      ...newTask,
      dueDate: date,
    });
  };

  const handleCreateTask = () => {
    const formattedTask = {
      ...newTask,
      dueDate: newTask.dueDate
        ? format(newTask.dueDate, "yyyy-MM-dd'T'HH:mm:ss'Z'")
        : null,
    };

    const taskData = dispatch(createTask(formattedTask));
    taskData.then((result) => {
      if (result && result.meta.requestStatus) {
        if (result.meta.requestStatus === "rejected") {
          toast.error(result.payload);
        } else if (result.meta.requestStatus === "fulfilled") {
          toast.success("Task Created");
          handleClose();
        }
      }
    });
  };

  return (
    <div>
      {userInfo.isManager === "true" && (
        <Button
          onClick={handleOpen}
          component={motion.div}
          {...framerButtonVariants}
          style={{
            color: "#fff",
            backgroundColor: currentColor,
            borderRadius: "9999px",
            padding: "0.5rem 1.2rem",
            fontSize: "0.95rem",
            textTransform: "none",
          }}
        >
          New Task
        </Button>
      )}
      <Drawer anchor="right" open={open} onClose={handleClose}>
        <Box p={2} width={800}>
          <Typography variant="h6">Create New Task</Typography>
          <Grid container spacing={3}>
            {[
              { label: "Title", id: "title" },
              { label: "Summary", id: "summary" },
              { label: "Assignee", id: "taskAssigneeEmail" },
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
                value={newTask.status}
                onChange={handleInputChange("status")}
                fullWidth
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "black", // Change label color to black
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black", // Change outline color to black
                    },
                    "&:focused ": {
                      borderColor: "black", // Change outline color to black on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "black", // Change outline color to black on focus
                    },
                  },
                }}
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
                onChange={handleInputChange("type")}
                fullWidth
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "black", // Change label color to black
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black", // Change outline color to black
                    },
                    "&:focused ": {
                      borderColor: "black", // Change outline color to black on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "black", // Change outline color to black on focus
                    },
                  },
                }}
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
                onChange={handleInputChange("priority")}
                fullWidth
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "black", // Change label color to black
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black", // Change outline color to black
                    },
                    "&:focused ": {
                      borderColor: "black", // Change outline color to black on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "black", // Change outline color to black on focus
                    },
                  },
                }}
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={4}>
              <DatePicker
                id="dueDate"
                selected={newTask.dueDate}
                onChange={handleDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="form-control"
              />
            </Grid>
          </Grid>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              type="submit"
              component={motion.div}
              {...framerButtonVariants}
              style={{
                color: "#fff",
                backgroundColor: currentColor,
                borderRadius: "9999px",
                padding: "0.5rem 1.2rem",
                fontSize: "0.95rem",
                textTransform: "none",
              }}
              onClick={handleCreateTask}
            >
              Create Task
            </Button>
            <Button
              onClick={handleClose}
              component={motion.div}
              {...framerButtonVariants}
              style={{
                color: "#fff",
                backgroundColor: currentColor,
                borderRadius: "9999px",
                padding: "0.4rem 1.5rem",
                fontSize: "0.95rem",
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};

export default CreateTaskModal;
