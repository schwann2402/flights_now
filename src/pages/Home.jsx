/* eslint-disable react/prop-types */
"use client";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState, useMemo } from "react";
import {
  getAirportId,
  getAirportOptions,
  getFlightDetails,
} from "../services/flightService";
import { debounce } from "@mui/material/utils";
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
  const [origin, setOrigin] = useState("");
  const [originInputValue, setOriginInputValue] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationInputValue, setDestinationInputValue] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [originOptions, setOriginOptions] = useState([]);

  const fetch = useMemo(
    () =>
      debounce(async (input, callback) => {
        try {
          const response = await getAirportOptions(input);
          callback(response);
        } catch (error) {
          console.log("Error fetching location", error);
          callback([]);
        }
      }, 400),
    []
  );

  useEffect(() => {
    let active = true;

    if (originInputValue === "") {
      setOriginOptions(origin ? [origin] : []);
      return undefined;
    }

    fetch(originInputValue, (results) => {
      if (active) {
        let newOptions = [];

        if (origin) {
          newOptions = [origin];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOriginOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [origin, originInputValue, fetch]);

  useEffect(() => {
    let active = true;

    if (destinationInputValue === "") {
      setDestinationOptions(destination ? [destination] : []);
      return undefined;
    }

    fetch(destinationInputValue, (results) => {
      if (active) {
        let newOptions = [];

        if (destination) {
          newOptions = [destination];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setDestinationOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [destination, destinationInputValue, fetch]);

  const getOptionLabel = (option) => {
    if (typeof option === "string") {
      return option;
    }
    return option.suggestionTitle ? option.suggestionTitle : "";
  };

  const handleSearch = async (event) => {
    setResults([]);
    setIsLoading(true);
    event.preventDefault();
    const originInfo = await getAirportId(origin.title);
    const destinationInfo = await getAirportId(destination.title);
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
              options={originOptions}
              getOptionLabel={getOptionLabel}
              renderOption={(props, option) => (
                <li {...props}>
                  <div>
                    <div>{option.suggestionTitle}</div>
                    {option.subtitle && (
                      <div style={{ fontSize: "0.8em", color: "white" }}>
                        {option.subtitle}
                      </div>
                    )}
                  </div>
                </li>
              )}
              sx={{ flexGrow: 1 }}
              renderInput={(params) => <TextField {...params} label="From" />}
              onChange={(event, newValue) => {
                setOriginOptions(
                  newValue ? [newValue, ...originOptions] : originOptions
                );
                setOrigin(newValue);
              }}
              onInputChange={(event, newInputValue) => {
                setOriginInputValue(newInputValue);
              }}
              value={origin}
            />
            <IconButton>
              <SwapHoriz />
            </IconButton>
            <Autocomplete
              disablePortal
              options={destinationOptions}
              getOptionLabel={getOptionLabel}
              renderOption={(props, option) => (
                <li {...props}>
                  <div>
                    <div>{option.suggestionTitle}</div>
                    {option.subtitle && (
                      <div style={{ fontSize: "0.8em", color: "white" }}>
                        {option.subtitle}
                      </div>
                    )}
                  </div>
                </li>
              )}
              sx={{ flexGrow: 1 }}
              renderInput={(params) => <TextField {...params} label="To" />}
              onChange={(event, newValue) => {
                setDestinationOptions(
                  newValue
                    ? [newValue, ...destinationOptions]
                    : destinationOptions
                );
                setDestination(newValue);
              }}
              onInputChange={(event, newInputValue) => {
                setDestinationInputValue(newInputValue);
              }}
              value={destination}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Departure"
                  onChange={(date) => {
                    const formattedDate = date.toISOString().split("T")[0];
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
