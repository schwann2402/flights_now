/* eslint-disable react/prop-types */
import { Card, CardContent, Collapse, Typography, Box } from "@mui/material";
import { useState } from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const Flight = ({ flight }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpansion = () => {
    setExpanded(!expanded);
  };

  const logo = flight.legs[0].carriers.marketing[0].logoUrl;
  const departureTime = flight.legs[0].departure.split("T")[1].slice(0, 5);
  const arrivalTime = flight.legs[0].arrival.split("T")[1].slice(0, 5);
  const airline = flight.legs[0].carriers.marketing[0].name;
  const duration =
    Math.floor(flight.legs[0].durationInMinutes / 60) +
    " hr " +
    (flight.legs[0].durationInMinutes % 60) +
    " min ";
  const originCode = flight.legs[0].origin.id;
  const destinationCode = flight.legs[0].destination.id;
  const numOfSegments = flight.legs[0].segments.length;
  const price = flight.price.formatted;

  return (
    <Card
      sx={{
        mb: 2,
        "&:hover": {
          cursor: "pointer",
        },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: 5,
        }}
        onClick={handleExpansion}
      >
        <img
          src={logo}
          style={{
            maxWidth: "30px",
            height: "auto",
            textAlign: "center",
          }}
        />
        <Box>
          <Typography variant="subtitle1">
            {departureTime}
            {parseInt(departureTime.slice(0, 3)) >= 12 ? "PM" : "AM"} -{" "}
            {arrivalTime}
            {parseInt(arrivalTime.slice(0, 3)) >= 12 ? "PM" : "AM"}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: "10px",
            }}
          >
            {airline}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {duration}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: "10px",
            }}
          >
            {originCode} - {destinationCode}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          {numOfSegments} stop
          {numOfSegments > 0 ? "s" : ""}
        </Typography>
        <Typography variant="h6" color="success">
          {price}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          round trip
        </Typography>
        <KeyboardArrowDownIcon
          sx={{
            "&:hover": {
              borderRadius: "100%",
              backgroundColor: "white",
              color: "black",
              opacity: 0.5,
            },
          }}
        />
      </CardContent>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>
            Additional flight details go here. This could include information
            about the aircraft, in-flight amenities, baggage allowance, etc.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default Flight;
