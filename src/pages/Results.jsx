/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";

import Flight from "../components/Flight";
import { ArrowDownward, ArrowUpward, FilterList } from "@mui/icons-material";
import { useState } from "react";

const Results = ({ flights }) => {
  const [sorted, setSorted] = useState("priceUp");
  const [stops, setStops] = useState("");
  const [airline, setAirline] = useState("");

  const airlines = flights.map(
    (flight) => flight.legs[0].carriers.marketing[0].name
  );

  if (sorted === "priceDown") {
    flights = flights.sort(
      (a, b) => b.price.formatted.slice(1) - a.price.formatted.slice(1)
    );
  }

  if (sorted === "priceUp") {
    flights = flights.sort(
      (a, b) => a.price.formatted.slice(1) - b.price.formatted.slice(1)
    );
  }

  if (airline) {
    flights = flights.filter(
      (flight) => flight.legs[0].carriers.marketing[0].name === airline
    );
  }
  if (flights.length === 0) {
    return <div>No flights match your origin and destination!</div>;
  }

  if (stops == 1) {
    flights = flights.filter((flight) => flight.legs[0].segments.length === 1);
  } else if (stops == 2) {
    flights = flights.filter((flight) => flight.legs[0].segments.length === 2);
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          mb: 3,
          justifyContent: "center",
          flexDirection: { xs: "column", sm: "row" }, // Stack on mobile, row on larger screens
        }}
      >
        <Button
          startIcon={<FilterList />}
          variant={
            sorted !== "priceUp" || stops || airline ? "contained" : "outlined"
          }
          size="small"
          onClick={() => {
            setSorted("priceUp");
            setStops("");
            setAirline("");
          }}
          sx={{ mb: { xs: 2, sm: 0 } }}
        >
          All filters
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() =>
            setSorted(sorted === "priceUp" ? "priceDown" : "priceUp")
          }
          sx={{ mb: { xs: 2, sm: 0 } }}
        >
          Price {(sorted === "priceUp" || sorted === "") && <ArrowUpward />}
          {sorted === "priceDown" && <ArrowDownward />}
        </Button>
        <FormControl sx={{ minWidth: "120px" }}>
          <InputLabel
            size="string"
            id="demo-simple-select-label"
            shrink={stops !== ""}
            sx={{ fontSize: "14px", color: "#8ab4f8" }}
          >
            STOPS
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={stops}
            onChange={(event) => setStops(event.target.value)}
            autoWidth
          >
            <MenuItem value={""}>Any</MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: "120px" }}>
          <InputLabel
            size="string"
            id="airlineSelectLabel"
            shrink={airline !== ""}
            sx={{ fontSize: "14px", color: "#8ab4f8" }}
          >
            AIRLINES
          </InputLabel>
          <Select
            labelId="airlineSelectLabel"
            id="airlineSelect"
            value={airline}
            onChange={(event) => setAirline(event.target.value)}
            autoWidth
          >
            <MenuItem value={""}>Any</MenuItem>
            {[...new Set(airlines)].map((airline, index) => (
              <MenuItem key={index} value={airline}>
                {airline}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box maxWidth="lg" sx={{ margin: "auto" }}>
        {flights
          .sort(
            (a, b) => parseInt(b.price.formatted) - parseInt(a.price.formatted)
          )
          .map((flight, index) => (
            <Flight key={index} flight={flight} />
          ))}
      </Box>
    </Box>
  );
};

export default Results;
