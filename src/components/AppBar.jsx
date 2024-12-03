import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import {
  Menu as MenuIcon,
  FlightTakeoff,
  Hotel,
  Explore,
  Home,
} from "@mui/icons-material";

export default function ButtonAppBar() {
  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          FlightsNow
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button startIcon={<FlightTakeoff />} color="inherit">
            Travel
          </Button>
          <Button startIcon={<Explore />} color="inherit">
            Explore
          </Button>
          <Button startIcon={<FlightTakeoff />} color="inherit">
            Flights
          </Button>
          <Button startIcon={<Hotel />} color="inherit">
            Hotels
          </Button>
          <Button startIcon={<Home />} color="inherit">
            Vacation rentals
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
