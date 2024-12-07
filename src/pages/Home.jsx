/* eslint-disable react/prop-types */

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState, useMemo, useCallback } from "react";

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
  Typography,
  Grid2,
} from "@mui/material";
import { SwapHoriz } from "@mui/icons-material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8ab4f8",
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#121212",
          margin: 0,
          padding: 0,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#1E1E1E",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          backgroundColor: "#1E1E1E",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "uppercase",
          fontWeight: "bold",
          padding: "8px 24px",
        },
      },
    },
  },
});

export default function Home({ setResults, setIsLoading }) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [originOptions, setOriginOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [error, setError] = useState(null);

  const fetchAirportOptions = useMemo(
    () =>
      debounce(async (input, setOptions) => {
        try {
          const response = await getAirportOptions(input);
          setOptions(response);
        } catch (error) {
          console.log("Error fetching location", error);
          setOptions([]);
        }
      }, 400),
    []
  );

  const fetchOptions = useCallback(
    (inputValue, setter, selectedOption) => {
      if (inputValue === "") {
        setter(selectedOption ? [selectedOption] : []);
        return;
      }

      fetchAirportOptions(inputValue, (results) => {
        const options = selectedOption ? [selectedOption, ...results] : results;
        setter(options);
      });
    },
    [fetchAirportOptions]
  );

  useEffect(() => {
    fetchOptions(origin, setOriginOptions, origin);
  }, [origin]);

  useEffect(() => {
    fetchOptions(destination, setDestinationOptions, destination);
  }, [destination]);

  const handleDepartureDateChange = (date) => {
    setDepartureDate(date);
    if (date && returnDate && date.isAfter(returnDate)) {
      setError("Departure date cannot be later than return date");
    } else {
      setError(null);
    }
  };

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleReturnDateChange = (date) => {
    setReturnDate(date);
    if (departureDate && date.isBefore(departureDate)) {
      setError("Return date cannot be earlier than departure date");
    } else {
      setError(null);
    }
  };

  const handleSearch = async (event) => {
    console.log(typeof origin == "string", typeof destination);
    setResults([]);
    setIsLoading(true);
    event.preventDefault();

    const formattedDepartureDate = departureDate
      ? departureDate.toISOString().split("T")[0]
      : null;
    const formattedReturnDate = returnDate
      ? returnDate.toISOString().split("T")[0]
      : null;

    try {
      const originInfo = await getAirportId(
        typeof origin == "string" ? origin.split("(")[0].trim() : origin.title
      );
      const destinationInfo = await getAirportId(
        typeof destination == "string"
          ? destination.split("(")[0].trim()
          : destination.title
      );
      const flightDetails = await getFlightDetails(
        originInfo,
        destinationInfo,
        formattedDepartureDate,
        formattedReturnDate
      );
      const results = flightDetails.data.data.itineraries;
      setResults(results);
      setIsLoading(false);
      if (results.length === 0) setIsLoading("No results");
    } catch (error) {
      setIsLoading(false);
      setError("Error fetching flight details");
      console.error(error);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ p: 3 }} bgcolor="background.default">
        <Grid2 container spacing={2}>
          <Grid2 xs={12} sm={6} md={4}>
            <Select value="roundtrip" size="small" fullWidth>
              <MenuItem value="roundtrip">Round trip</MenuItem>
              <MenuItem value="oneway">One way</MenuItem>
            </Select>
          </Grid2>
          <Grid2 xs={12} sm={6} md={4}>
            <Select value="1" size="small" fullWidth>
              <MenuItem value="1">1 passenger</MenuItem>
              <MenuItem value="2">2 passengers</MenuItem>
            </Select>
          </Grid2>
          <Grid2 xs={12} sm={6} md={4}>
            <Select value="economy" size="small" fullWidth>
              <MenuItem value="economy">Economy</MenuItem>
              <MenuItem value="business">Business</MenuItem>
            </Select>
          </Grid2>
        </Grid2>

        <Paper sx={{ mb: 3, p: 2 }}>
          <Grid2
            container
            spacing={2}
            alignItems="center"
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <Grid2 xs={12} sm={5}>
              <Autocomplete
                disablePortal
                options={originOptions}
                getOptionLabel={(option) => option.suggestionTitle || option}
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
                sx={{ flexGrow: 1, minWidth: { md: "300px" } }}
                renderInput={(params) => <TextField {...params} label="From" />}
                onChange={(event, newValue) => {
                  setOrigin(newValue);
                  setOriginOptions(
                    newValue ? [newValue, ...originOptions] : originOptions
                  );
                }}
                onInputChange={(event, newInputValue) => {
                  setOrigin(newInputValue);
                }}
                value={origin}
              />
            </Grid2>
            <Grid2 xs="auto">
              <IconButton onClick={handleSwap}>
                <SwapHoriz />
              </IconButton>
            </Grid2>
            <Grid2 xs={12} sm={5}>
              {" "}
              <Autocomplete
                disablePortal
                options={destinationOptions}
                getOptionLabel={(option) => option.suggestionTitle || option}
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
                sx={{ flexGrow: 1, minWidth: { md: "300px" } }}
                renderInput={(params) => <TextField {...params} label="To" />}
                onChange={(event, newValue) => {
                  setDestination(newValue);
                  setDestinationOptions(
                    newValue
                      ? [newValue, ...destinationOptions]
                      : destinationOptions
                  );
                }}
                onInputChange={(event, newInputValue) => {
                  setDestination(newInputValue);
                }}
                value={destination}
              />
            </Grid2>

            <Grid2 container spacing={2}>
              <Grid2 xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Departure"
                    value={departureDate}
                    onChange={handleDepartureDateChange}
                    slots={{ textField: TextField }}
                    slotProps={{
                      textField: {
                        variant: "outlined",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid2>
              <Grid2 xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Return"
                    value={returnDate}
                    onChange={handleReturnDateChange}
                    slots={{ textField: TextField }}
                    slotProps={{
                      textField: {
                        variant: "outlined",
                      },
                    }}
                    minDate={departureDate}
                  />
                </LocalizationProvider>
              </Grid2>
            </Grid2>
            <Button variant="contained" onClick={handleSearch}>
              Search
            </Button>
          </Grid2>
          {error && (
            <Typography
              color="error"
              variant="body2"
              sx={{ textAlign: "center" }}
            >
              {error}
            </Typography>
          )}
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
