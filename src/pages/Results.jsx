/* eslint-disable react/prop-types */
import { Box } from "@mui/material";

import Flight from "../components/Flight";

const Results = ({ flights }) => {
  if (flights.length === 0) {
    return <div>No flights match your origin and destination!</div>;
  }
  return (
    <Box maxWidth="lg" sx={{ margin: "auto" }}>
      {flights.map((flight, index) => (
        <Flight key={index} flight={flight} />
      ))}
    </Box>
  );
};

export default Results;
