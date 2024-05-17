import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import product1 from "../data/product1.jpg";
import { useSelector } from "react-redux";
import { useStateContext } from "../contexts/ContextProvider";
import { motion } from "framer-motion";
import { framerButtonVariants } from "./framer";

const ProjectCard = ({ project, onViewDetails, onDelete }) => {
  const { currentColor } = useStateContext();
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <Card className="w-64 relative" style={{ borderRadius: "1rem" }}>
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
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">{project.title}</h3>
          <p className="text-sm text-gray-500 mb-4">{project.summary}</p>
          {/* Uncomment and adjust the image section as needed */}
          {/* <img
          alt="Project Image"
          className="w-full h-32 object-cover mb-2"
          height="200"
          src={product1}
          style={{
            aspectRatio: "200/200",
            objectFit: "cover",
          }}
          width="200"
        /> */}
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
