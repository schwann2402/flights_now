import "./App.css";
import { useState } from "react";
import { Typography, Box } from "@mui/material";
import FlightSearch from "./pages/Home";
import FlightResultsGrid from "./pages/Results";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AppBar from "./components/AppBar";
import Loading from "./components/Loading";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8ab4f8",
    },
  },
});

function App() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box bgcolor="background.default" sx={{ minHeight: "100vh" }}>
        <AppBar />
        <FlightSearch setResults={setResults} setIsLoading={setIsLoading} />
        {isLoading && <Loading />}
        {results === "No results" && (
          <div
            style={{
              color: "white",
              marginTop: 50,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography style={{ display: "flex" }}>
              Oops! No flights were found!
              <SentimentDissatisfiedIcon />
            </Typography>
            <Typography>Change your origin or destination</Typography>
          </div>
        )}
        {results.length > 0 && <FlightResultsGrid flights={results} />}
      </Box>
    </ThemeProvider>
  );
}
export default App;
