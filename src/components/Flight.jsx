/* eslint-disable react/prop-types */
import {
  Button,
  Card,
  CardContent,
  Collapse,
  Typography,
  Box,
} from "@mui/material";
import { useState } from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CircleIcon from "@mui/icons-material/Circle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  AirlineSeatLegroomNormal,
  PhoneIphone,
  Usb,
} from "@mui/icons-material";

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
        padding: { xs: 1, sm: 2 },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          paddingLeft: 0,
        }}
        onClick={handleExpansion}
      >
        <img
          src={logo}
          style={{
            maxWidth: "30px",
            height: "auto",
            marginBottom: 8,
          }}
        />
        <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
          <Typography variant="subtitle1">
            {departureTime}
            {parseInt(departureTime.slice(0, 3)) >= 12 ? "PM" : "AM"} -{" "}
            {arrivalTime}
            {parseInt(arrivalTime.slice(0, 3)) >= 12 ? "PM" : "AM"}
            {flight.legs[0].timeDeltaInDays > 0 ? (
              <span style={{ position: "relative", top: -5, fontSize: "10px" }}>
                {flight.legs[0].timeDeltaInDays}
              </span>
            ) : (
              ""
            )}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: "10px",
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            {airline}
          </Typography>
        </Box>
        <Box sx={{ textAlign: { xs: "center", sm: "right" } }}>
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
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            {originCode} - {destinationCode}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: { xs: "center", sm: "left" } }}
        >
          {numOfSegments} stop
          {numOfSegments > 0 ? "s" : ""}
        </Typography>
        <Typography
          variant="h6"
          color="success"
          sx={{ textAlign: { xs: "center", sm: "left" } }}
        >
          {price}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: { xs: "center", sm: "left" } }}
        >
          round trip
        </Typography>
        {expanded && (
          <Button variant="contained" sx={{ borderRadius: 5 }}>
            Select flight
          </Button>
        )}
        <KeyboardArrowDownIcon
          sx={{
            "&:hover": {
              borderRadius: "100%",
              backgroundColor: "white",
              color: "black",
              opacity: 0.5,
            },
            marginTop: { xs: 1, sm: 0 },
          }}
        />
      </CardContent>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            paddingX: 5,
            gap: 2,
          }}
        >
          {" "}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CircleIcon />
              <MoreVertIcon />
              <CircleIcon />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography>
                {" "}
                {departureTime}
                {parseInt(departureTime.slice(0, 3)) >= 12 ? "PM" : "AM"} -{" "}
                {flight.legs[0].origin.name} ({originCode})
              </Typography>
              <Typography variant="subtitle" color="lightgray">
                Travel time: {duration}
              </Typography>
              <Typography>
                {arrivalTime}
                {parseInt(arrivalTime.slice(0, 3)) >= 12 ? "PM" : "AM"} -{" "}
                {flight.legs[0].destination.name} ({destinationCode})
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    fontSize: "11px",
                    color: "lightblue",
                  }}
                >
                  {airline}
                  <span style={{ fontSize: "inherit" }}>
                    Flight Number {flight.legs[0].segments[0].flightNumber}
                  </span>
                </Box>
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography
              sx={{
                display: "inline-block",
                fontSize: { xs: "12px", sm: "14px" },
              }}
            >
              <AirlineSeatLegroomNormal /> Below average legroom (29in){" "}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "12px", sm: "14px" },
              }}
            >
              <Usb />
              In-seat USB outlet{" "}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "12px", sm: "14px" },
              }}
            >
              <PhoneIphone />
              Stream media to your device
            </Typography>
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default Flight;
