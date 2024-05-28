import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import {
  TextField,
  Select,
  MenuItem,
  Box,
  Grid,
  InputLabel,
  FormControl,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { framerButtonVariants } from "../components/framer";
import { useStateContext } from "../contexts/ContextProvider";
import { createTask } from "../features/tasks/taskActions";
import useMediaQuery from "@mui/material/useMediaQuery";

// Modify the CustomInput to accept label as props
const CustomInput = React.forwardRef(
  (
    { onClick, value, currentColor, placeholder, label, onFocus, onBlur },
    ref
  ) => (
    <FormControl
      variant="outlined"
      fullWidth
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: currentColor },
          "&:hover fieldset": { borderColor: currentColor },
          "&.Mui-focused fieldset": { borderColor: currentColor },
        },
        "& .MuiInputLabel-root": {
          color: currentColor,
          "&.Mui-focused": {
            color: currentColor,
          },
        },
      }}
    >
      <InputLabel
        shrink={value ? true : undefined}
        htmlFor="datepicker-input"
        sx={{
          color: currentColor,
          "&.Mui-focused": {
            color: currentColor,
          },
        }}
      >
        {label}
      </InputLabel>
      <TextField
        id="datepicker-input"
        onClick={onClick}
        value={value}
        ref={ref}
        placeholder={placeholder}
        label={label}
        onFocus={onFocus}
        onBlur={onBlur}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          style: {
            borderColor: currentColor,
          },
        }}
        fullWidth
      />
    </FormControl>
  )
);

const CreateTaskModal = () => {
  const { currentColor } = useStateContext();
  const [open, setOpen] = useState(false);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:900px)");
  const currentDate = new Date();
  const formattedCurrentDate = format(currentDate, "yyyy-MM-dd'T'HH:mm:ss'Z'");
  const [newTask, setNewTask] = useState({
    title: "",
    status: "Open",
    summary: "",
    type: "Bug",
    priority: "High",
    taskAssigneeEmail: "",
    dueDate: null,
    startDate: formattedCurrentDate,
    projectId: projectId,
    taskCreatorId: userInfo.id,
    turnedInAt: "",
  });
  const [isDatePickerFocused, setIsDatePickerFocused] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (field) => (event) => {
    setNewTask({ ...newTask, [field]: event.target.value });
  };

  const handleDateChange = (date) => {
    setNewTask({ ...newTask, dueDate: date });
  };

  const handleCreateTask = () => {
    const formattedTask = {
      ...newTask,
      dueDate: newTask.dueDate
        ? format(newTask.dueDate, "yyyy-MM-dd'T'HH:mm:ss'Z'")
        : null,
    };
    dispatch(createTask(formattedTask)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Task Created");
        handleClose();
      } else {
        toast.error(result.payload);
      }
    });
  };

  const fields = [
    { label: "Title", id: "title" },
    { label: "Summary", id: "summary" },
    { label: "Assignee Email", id: "taskAssigneeEmail" },
    {
      label: "Status",
      id: "status",
      options: ["Open", "InProgress", "Review", "Close"],
    },
    {
      label: "Type",
      id: "type",
      options: ["Bug", "Feature", "Enhancement"],
    },
    {
      label: "Priority",
      id: "priority",
      options: ["High", "Medium", "Low"],
    },
  ];

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
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: isMobile ? "100%" : isTablet ? "63%" : "70%",
            height: isMobile ? "calc(100% - 64px)" : "100vh", // Adjust height to account for margin
            marginTop: isMobile && "64px", // Add top margin
            overflow: "auto", // Enable scrolling
          },
        }}
      >
        <Box p={2}>
          <Typography variant="h6">Create New Task</Typography>
          <Grid container spacing={3}>
            {fields.map((field) => (
              <Grid item xs={12} sm={6} key={field.id}>
                {field.options ? (
                  <FormControl
                    fullWidth
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: currentColor },
                        "&:hover fieldset": { borderColor: currentColor },
                        "&.Mui-focused fieldset": { borderColor: currentColor },
                      },
                      "& .MuiInputLabel-root": {
                        color: currentColor,
                        "&.Mui-focused": {
                          color: currentColor,
                        },
                      },
                    }}
                  >
                    <InputLabel id={field.id}>{field.label}</InputLabel>
                    <Select
                      labelId={field.id}
                      label={field.label}
                      value={newTask[field.id]}
                      onChange={handleInputChange(field.id)}
                    >
                      {field.options.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    label={field.label}
                    variant="outlined"
                    fullWidth
                    value={newTask[field.id]}
                    onChange={handleInputChange(field.id)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: currentColor },
                        "&:hover fieldset": { borderColor: currentColor },
                        "&.Mui-focused fieldset": { borderColor: currentColor },
                      },
                      "& .MuiInputLabel-root": {
                        color: currentColor,
                        "&.Mui-focused": {
                          color: currentColor,
                        },
                      },
                    }}
                  />
                )}
              </Grid>
            ))}
            <Grid item xs={12} sm={6}>
              <DatePicker
                selected={newTask.dueDate}
                onChange={handleDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={new Date()}
                customInput={
                  <CustomInput
                    currentColor={currentColor}
                    placeholder="Select due date"
                    label="Due Date"
                    onFocus={() => setIsDatePickerFocused(true)}
                    onBlur={() => setIsDatePickerFocused(false)}
                  />
                }
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
