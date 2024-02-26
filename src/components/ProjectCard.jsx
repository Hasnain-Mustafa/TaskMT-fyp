// ProjectCard.js
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import product1 from '../data/product1.jpg';

import { useStateContext } from '../contexts/ContextProvider';
const ProjectCard = ({ name, description, onViewDetails, onDelete }) => {
    const { currentColor } = useStateContext();
  
  return (
    <Card className="w-64 relative">
      <IconButton
        style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}
        onClick={onDelete}
        aria-label="Delete"
        color="error"
      >
        <DeleteOutlineOutlinedIcon />
      </IconButton>

      <CardContent className="p-4 mb-4">
        <h3 className="text-lg font-semibold mb-1">{name}</h3>
        <p className="text-sm text-gray-500 mb-2">{description}</p>
        <img
          alt="Project Image"
          className="w-full h-32 object-cover mb-2"
          height="200"
          src={product1}
          style={{
            aspectRatio: '200/200',
            objectFit: 'cover',
          }}
          width="200"
        />
        <Button className="text-xs" variant="outlined" onClick={onViewDetails}  style={{ color: currentColor }}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
