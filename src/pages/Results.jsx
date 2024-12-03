/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";

import Flight from "../components/Flight";

const Results = ({ flights }) => {
  if (flights.length === 0) {
    return <div>No flights match your origin and destination!</div>;
  }
  return (
    <Box maxWidth="lg" sx={{ margin: "auto" }}>
      <Typography variant="subtitle1" color="primary" sx={{ mb: 2 }}>
        Choose your departing flight
      </Typography>
      {flights.map((flight, index) => (
        <Flight key={index} flight={flight} />
      ))}
    </Box>
  );
};

export default Results;
