import { Box, AppBar, Toolbar, Button, Typography } from "@mui/material";

function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#8990b4ff", borderRadius: "10px" }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0 20px' }}>
          <Typography variant="h6">Trash App</Typography>
          <Button sx={{
            backgroundColor: "#215e80ff",
            color: "#fff",
            '&:hover': {
              backgroundColor: "#1a9ed1", // slightly darker for hover
            },}} 
            variant="contained" size="small" href="/">Home</Button>
          <Button sx={{
            backgroundColor: "#215e80ff",
            color: "#fff",
            '&:hover': {
              backgroundColor: "#1a9ed1", // slightly darker for hover
            },}}
            variant="contained" size="small" href="/Comp1">Wybierz Rejon</Button>
          <Button sx={{
            backgroundColor: "#215e80ff",
            color: "#fff",
            '&:hover': {
              backgroundColor: "#1a9ed1", // slightly darker for hover
            },}}
            variant="contained" size="small" href="/Comp2">Wybierz Ulicę</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
