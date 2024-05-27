import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useSelector } from "react-redux";
import { useStateContext } from "../contexts/ContextProvider";
import { motion } from "framer-motion";
import { framerButtonVariants } from "./framer";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"; // Import the edit icon

const ProjectCard = ({ project, onViewDetails, onDelete, onEdit }) => {
  const { currentColor } = useStateContext();
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className=" p-4">
      <Card className="w-64 relative" style={{ borderRadius: "1rem" }}>
        {userInfo.isManager === "true" && (
          <>
            <IconButton
              style={{ position: "absolute", top: 0, right: 0, zIndex: 1 }}
              component={motion.div}
              {...framerButtonVariants}
              onClick={onDelete}
              aria-label="Delete"
              color="error"
            >
              <DeleteOutlineOutlinedIcon />
            </IconButton>
            <IconButton
              style={{
                position: "absolute",
                top: 0,
                right: 40,
                zIndex: 1,
                color: currentColor,
                fontSize: "small",
              }}
              component={motion.div}
              {...framerButtonVariants}
              // onClick={onEdit} // Added onClick event for editing
              aria-label="Edit"
              onClick={onEdit}
              color="inherit" // Set color to inherit for black
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </>
        )}
        <CardContent>
          <h3 className="text-lg font-semibold mb-4 mt-5">{project.title}</h3>
          <p className="text-sm text-gray-500 mb-4">{project.summary}</p>
          <Button
            onClick={() => onViewDetails(project.id)}
            type="button"
            component={motion.div}
            {...framerButtonVariants}
            style={{
              color: "#fff",
              backgroundColor: currentColor,
              borderRadius: "9999px",
              padding: "0.6rem 1rem",
              fontSize: "0.7rem",
              textTransform: "none",
            }}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
      {/* Place ProjectCard components here */}
    </div>
  );
};

export default ProjectCard;
