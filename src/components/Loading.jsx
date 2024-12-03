import { CircularProgress, Box, Typography } from "@mui/material";

export default function Loading() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="20vh"
    >
      <CircularProgress size={60} />
      <Typography variant="h6" style={{ marginTop: "20px", color: "white" }}>
        Loading your flights...
      </Typography>
    </Box>
  );
}
