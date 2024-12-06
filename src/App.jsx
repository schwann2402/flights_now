import "./App.css";
import { useState } from "react";
import { Typography, Box, useMediaQuery } from "@mui/material";
import Home from "./pages/Home";
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
    background: {
      default: "#1a1a1a",
      paper: "#242424",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#242424",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          backgroundColor: "#242424",
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

function App() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        bgcolor="background.default"
        sx={{ minHeight: "100vh", p: isMobile ? 2 : 3 }}
      >
        <AppBar />
        <Home setResults={setResults} setIsLoading={setIsLoading} />
        {isLoading && <Loading />}
        {results === "No results" && (
          <Box
            style={{
              color: "white",
              mt: 5,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
            >
              Oops! No flights were found!
              <SentimentDissatisfiedIcon />
            </Typography>
            <Typography sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
              Change your origin or destination
            </Typography>
          </Box>
        )}
        {results.length > 0 && <FlightResultsGrid flights={results} />}
      </Box>
    </ThemeProvider>
  );
}
export default App;
