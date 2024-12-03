/* eslint-disable react/prop-types */
"use client";

import airportData from "../assets/airports.json";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import { getAirportId, getFlightDetails } from "../services/flightService";

import {
  Autocomplete,
  IconButton,
  Box,
  Button,
  Paper,
  TextField,
  Select,
  MenuItem,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { SwapHoriz, FilterList, KeyboardArrowDown } from "@mui/icons-material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8ab4f8",
    },
  },
});

export default function FlightSearch({ setResults, setIsLoading }) {
  const [cities, setCities] = useState([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  useEffect(() => {
    const places = [
      ...new Set(
        airportData.map((airport) => airport.city + ": " + airport.name)
      ),
    ];
    setCities(places);
  }, []);

  const handleSearch = async (event) => {
    setResults([]);
    setIsLoading(true);
    event.preventDefault();
    const originInfo = await getAirportId(origin);
    const destinationInfo = await getAirportId(destination);
    const flightDetails = await getFlightDetails(
      originInfo,
      destinationInfo,
      departureDate,
      returnDate
    );
    const results = flightDetails.data.data.itineraries;
    setIsLoading(false);
    if (results.length === 0) {
      setIsLoading("No results");
    }
    setResults(results);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ p: 3 }} bgcolor="background.default">
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Select value="roundtrip" size="small">
            <MenuItem value="roundtrip">Round trip</MenuItem>
            <MenuItem value="oneway">One way</MenuItem>
          </Select>
          <Select value="1" size="small">
            <MenuItem value="1">1 passenger</MenuItem>
            <MenuItem value="2">2 passengers</MenuItem>
          </Select>
          <Select value="economy" size="small">
            <MenuItem value="economy">Economy</MenuItem>
            <MenuItem value="business">Business</MenuItem>
          </Select>
        </Box>

        <Paper sx={{ mb: 3, p: 2 }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Autocomplete
              disablePortal
              options={cities}
              sx={{ flexGrow: 1 }}
              renderInput={(params) => <TextField {...params} label="From" />}
              onChange={() => {
                const [city, name] = event.target.innerHTML
                  .split(":")
                  .map((str) => str.trim());
                const result = airportData.filter(
                  (airport) => airport.city === city && airport.name === name
                )[0];
                setOrigin(result.iata_code);
              }}
            />
            <IconButton>
              <SwapHoriz />
            </IconButton>
            <Autocomplete
              disablePortal
              options={cities}
              sx={{ flexGrow: 1 }}
              renderInput={(params) => <TextField {...params} label="To" />}
              onChange={() => {
                const [city, name] = event.target.innerHTML
                  .split(":")
                  .map((str) => str.trim());
                const result = airportData.filter(
                  (airport) => airport.city === city && airport.name === name
                )[0];
                setDestination(result.iata_code);
              }}
            />

            <Box sx={{ display: "flex", gap: 1 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Departure"
                  onChange={(event) => {
                    const formattedDate = event.$d.toISOString().split("T")[0];
                    setDepartureDate(formattedDate);
                  }}
                />
                <DatePicker
                  label="Return"
                  onChange={(event) => {
                    const formattedDate = event.$d.toISOString().split("T")[0];
                    setReturnDate(formattedDate);
                  }}
                />
              </LocalizationProvider>
              <Button variant="contained" onClick={handleSearch}>
                Search
              </Button>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ display: "flex", gap: 1, mb: 3, justifyContent: "center" }}>
          <Button startIcon={<FilterList />} variant="outlined" size="small">
            All filters
          </Button>
          {[
            "Stops",
            "Airlines",
            "Bags",
            "Price",
            "Times",
            "Emissions",
            "Connecting airports",
            "Duration",
          ].map((filter) => (
            <Button
              key={filter}
              endIcon={<KeyboardArrowDown />}
              variant="outlined"
              size="small"
            >
              {filter}
            </Button>
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
