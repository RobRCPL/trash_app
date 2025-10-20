import { Box, AppBar, Toolbar, Button, Typography } from "@mui/material";
import { Recycling } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // ✅ Import Link

function Navbar() {
  const navButtons = [
    { label: "Home", to: "/" },
    { label: "Wybierz Rejon", to: "/Comp1" },
    { label: "Wybierz Ulicę", to: "/Comp2" },
    { label: "Powiadomienia", to: "/Addphone" },
    { label: "Co gdzie wyrzucić", to: "/Comp3" },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#4C763B",
          borderRadius: "10px",
          paddingBottom: "8px",
          paddingTop: "5px",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: { xs: 1, sm: 2, md: 5 },
            padding: { xs: "5px 10px", sm: "0 20px" },
          }}
        >
          {/* ICON + TITLE */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              <Recycling sx={{ color: "goldenrod", fontSize: "2rem" }} />
            </motion.div>

            <Typography
              variant="h6"
              sx={{
                color: "#FFFD8F",
                fontWeight: "bold",
                letterSpacing: "0.5px",
              }}
            >
              Trash App
            </Typography>
          </Box>

          {/* Navigation buttons */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {navButtons.map((btn) => (
              <Button
                key={btn.label}
                component={Link} // ✅ Use Link for SPA navigation
                to={btn.to}
                sx={{
                  backgroundColor: "#043915",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#B0CE88", color: "#043915" },
                }}
                variant="contained"
                size="small"
              >
                {btn.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;