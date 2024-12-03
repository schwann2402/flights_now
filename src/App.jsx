import "./App.css";
import ButtonAppBar from "./components/AppBar";
import { Container, Typography, TextField, Autocomplete } from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import airportData from "./assets/airports.json";
import { useEffect, useState } from "react";

function App() {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const places = [...new Set(airportData.map((airport) => airport.city))];
    setCities(places);
  }, []);
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
          />
          <Autocomplete
            disablePortal
            options={cities}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="To" />}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Departure" />
            <DatePicker label="Return" />
          </LocalizationProvider>
        </Container>
      </Container>
    </>
  );
}
export default App;
