import "./App.css";
import ButtonAppBar from "./components/AppBar";
import {
  Container,
  Typography,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import airportData from "./assets/airports.json";
import { useEffect, useState } from "react";
import { getAirportId, getFlightDetails } from "./services/flightService";

function App() {
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
    console.log(departureDate, returnDate);
    event.preventDefault();
    console.log(origin, destination);
    const originInfo = await getAirportId(origin);
    const destinationInfo = await getAirportId(destination);
    await getFlightDetails(
      originInfo,
      destinationInfo,
      departureDate,
      returnDate
    );
  };

  return (
    <>
      <ButtonAppBar />
      <Container sx={{ padding: 4 }}>
        <Typography variant="h4" color="primary">
          <FlightIcon />
          Where are you going to?
        </Typography>

        <Container sx={{ paddingTop: 5, display: "flex", gap: 5 }}>
          <Autocomplete
            disablePortal
            options={cities}
            sx={{ width: 300 }}
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
          <Autocomplete
            disablePortal
            options={cities}
            sx={{ width: 300 }}
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
        </Container>
      </Container>
    </>
  );
}
export default App;
