const getStatusColor = (status) => {
  switch (status) {
    case "Open":
      return "#FF0000"; // Red
    case "InProgress":
      return "#FFC0CB"; // Pink
    case "Testing":
      return "#FFFF00"; // Yellow
    case "Close":
      return "#008000"; // Green
    default:
      return "#000000"; // Black
  }
};
export const getCurrentFormattedTime = () => {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default getStatusColor;
