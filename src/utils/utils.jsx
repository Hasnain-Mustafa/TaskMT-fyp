
  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return '#FF0000'; // Red
      case 'InProgress':
        return '#FFC0CB'; // Pink
      case 'Testing':
        return '#FFFF00'; // Yellow
      case 'Close':
        return '#008000'; // Green
      default:
        return '#000000'; // Black
    }
  };
  
  export default getStatusColor;