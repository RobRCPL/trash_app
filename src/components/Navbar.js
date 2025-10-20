import { Box, AppBar, Toolbar, Button, Typography } from "@mui/material";

function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ 
          backgroundColor: "#4C763B", 
          borderRadius: "10px",
          paddingBottom: "8px",
          paddingTop: "5px"
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            flexWrap: 'wrap', // <- pozwala przyciskom zawijać się w dół
            justifyContent: 'space-between',
            gap: { xs: 1, sm: 2, md: 5 }, // responsywny odstęp między elementami
            padding: { xs: '5px 10px', sm: '0 20px' } // mniejszy padding na telefonach
          }}
        >
          <Typography variant="h6" sx={{ flexGrow: { xs: 1, sm: 0 }, color: "#FFFD8F" }}>Trash App</Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Button
              sx={{
                backgroundColor: "#043915",
                color: "#fff",
                '&:hover': { backgroundColor: "#B0CE88" },
              }}
              variant="contained"
              size="small"
              href="/"
            >
              Home
            </Button>
            <Button
              sx={{
                backgroundColor: "#043915",
                color: "#fff",
                '&:hover': { backgroundColor: "#B0CE88" },
              }}
              variant="contained"
              size="small"
              href="/Comp1"
            >
              Wybierz Rejon
            </Button>
            <Button
              sx={{
                backgroundColor: "#043915",
                color: "#fff",
                '&:hover': { backgroundColor: "#B0CE88" },
              }}
              variant="contained"
              size="small"
              href="/Comp2"
            >
              Wybierz Ulicę
            </Button>
            <Button
              sx={{
                backgroundColor: "#043915",
                color: "#fff",
                '&:hover': { backgroundColor: "#B0CE88" },
              }}
              variant="contained"
              size="small"
              href="/AddPhone"
            >
              Powiadomienia
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
