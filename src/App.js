import {Route, Routes, useLocation} from "react-router-dom";
import { useState, useEffect } from "react";
import Comp1 from "./components/Comp1";
import Comp2 from "./components/Comp2";
import Comp3 from "./components/Comp3";
import Navbar from "./components/Navbar";
import AddPhone from "./components/AddPhone";
import streetRegion from "./data/streetRegion.json";
import datyodbioru from "./data/datyodbioru.json";
import {Chip, Paper, Grid, Typography, Box} from '@mui/material';
import {Recycling, Delete, Grass, Description, Liquor, Trolley} from "@mui/icons-material";


function App() {

  const location = useLocation();

  const [selectedRegion, setSelectedRegion] = useState(() =>{
    return sessionStorage.getItem("selectedRegion") || "";
  });

  const [selectedRegionPickupDates, setSelectedRegionPickupDates] = useState([]);

  const handleRegionChange = (region, clearStreet = true) => {
    
    setSelectedRegion(region);
    sessionStorage.setItem("selectedRegion", region);

    if (clearStreet) {
      // Only clear street when user changes region manually
      setSelectedStreet("");
      sessionStorage.removeItem("selectedStreet");
    }
  };

  const formatRegion = (region) => {
  return region.replace(/([a-zA-Z]+)(\d+)/, "$1 $2");
  };

  const [selectedStreet, setSelectedStreet] = useState(() =>{
    return sessionStorage.getItem("selectedStreet") || "";
  });

  const handleStreetChange = (street) => {
    setSelectedStreet(street);
    sessionStorage.setItem("selectedStreet", street);
  };

  useEffect(() => {
  if (selectedRegion && selectedStreet) {
      // today's date (midnight)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // filter for selected region and future dates (including today)
      const regionData = datyodbioru
        .filter(item => {
          const odbiorDate = new Date(item.dataodbioru);
          odbiorDate.setHours(0, 0, 0, 0);
          return item.rejon === selectedRegion && odbiorDate >= today;
        })
        .sort((a, b) => new Date(a.dataodbioru) - new Date(b.dataodbioru)); // ascending sort
      setSelectedRegionPickupDates(regionData);
      console.log(regionData);
    }
  }, [selectedRegion, selectedStreet]);

  // Helper: liczy dni do odbioru, ignorując godziny
  const daysUntil = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // dzisiejsza północ 

    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0); // północ daty odbioru

    return Math.round((d - today) / (1000 * 60 * 60 * 24));
  };

  const getWasteIcon = (type) => {
    const lower = type.toLowerCase();
    if (lower.includes("bio")) return <Grass sx={{ color: "brown" }} />;
    if (lower.includes("papier")) return <Description sx={{ color: "#2196f3" }} />;
    if (lower.includes("szkło")) return <Liquor sx={{ color: "#4caf50" }} />;
    if (lower.includes("tworzywa") || lower.includes("metale"))
      return <Recycling sx={{ color: "goldenrod" }} />;
    if (lower.includes("zmieszane")) return <Delete sx={{ color: "#6d6d6d" }} />;
    if (lower.includes("gabaryty")) return <Trolley sx={{ color: "#6a1b9a" }} />;
    return <Recycling sx={{ color: "#6a1b9a" }} />;
  };

  return (
    <div style={{backgroundColor: "#B0CE88", padding: "5px", borderRadius: "10px", minHeight: "100vh"}}>
    <Navbar />

    <Routes>
      <Route
        path="/"
        element={
          !(selectedRegion && selectedStreet) && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              minHeight: "10%",
              textAlign: "center",
              padding: 3,
              margin: 3,
              borderRadius: 2,
              background: "linear-gradient(150deg, #4C763B, #B0CE88)",
              boxShadow: 3,
              color: "#fff",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: "bold",
                mb: 2,
                letterSpacing: "1px",
                textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
              }}
            >
              Wybierz rejon lub ulicę
            </Typography>

            <Typography
              variant="h6"
              sx={{
                maxWidth: "650px",
                lineHeight: 1.6,
                textShadow: "0.5px 0.5px 2px rgba(0,0,0,0.2)",
              }}
            >
              Sprawdź terminy wywozu odpadów dla wybranej ulicy lub rejonu.
            </Typography>
          </Box>
        )
        }
      />
      <Route
        path="/comp1"
        element={
          <Comp1
            strReg={streetRegion}
            selectedRegion={selectedRegion}
            selectedStreet={selectedStreet}
            onRegionChange={handleRegionChange}
            onStreetChange={handleStreetChange}
          />
        }
      />
      <Route
        path="/comp2"
        element={
          <Comp2
            strReg={streetRegion}
            selectedStreet={selectedStreet}
            onRegionChange={handleRegionChange}
            onStreetChange={handleStreetChange}
          />
        }
      />
      <Route
        path="/addphone"
        element={
          <AddPhone 
          selectedRegion={selectedRegion}
          selectedStreet={selectedStreet}/>
        }
      />
      <Route
        path="/comp3"
        element={
          <Comp3 />
        }
      />
    </Routes>

    <div style={{display: "flex", justifyContent: "left", gap: "15px", margin: "15px"}}>
    {selectedRegion && <Chip color="success" label={formatRegion(selectedRegion)} size="medium" sx={{ 
                borderRadius: "5px", 
                color: "#FFF", 
                backgroundColor: "#4C763B", // delikatny zielony dla kontrastu
                fontWeight: "bold",
                fontSize: "0.9rem"
              }}/>}
    {selectedStreet && <Chip color="success" label={selectedStreet} sx={{ 
                borderRadius: "5px", 
                color: "#FFF", 
                backgroundColor: "#4C763B", // delikatny zielony dla kontrastu
                fontWeight: "bold",
                fontSize: "0.9rem"
              }}/>}
    </div>

    {location.pathname !== "/Comp3" && selectedStreet && (
      <Paper
        elevation={4}
        style={{ padding: "20px", margin: "15px", textAlign: "left" }}
      >
        {selectedRegionPickupDates.length > 0 ? (
          <div>
            <h3 style={{ marginBottom: "15px", color: "#000000ff" }}>
              Najbliższe terminy odbioru odpadów dla ulicy{" "}
              <Chip label={selectedStreet} sx={{ 
                borderRadius: "5px", 
                color: "#FFF", 
                backgroundColor: "#4C763B", // delikatny zielony dla kontrastu
                fontWeight: "bold",
                fontSize: "0.9rem"
              }}/> w{" "}
              <Chip color="success" label={formatRegion(selectedRegion)} sx={{ 
                borderRadius: "5px", 
                color: "#FFF", 
                backgroundColor: "#4C763B", // delikatny zielony dla kontrastu
                fontWeight: "bold",
                fontSize: "0.9rem"
              }}/>:
            </h3>

            {/** GROUPED BY MONTH */}
            {Object.entries(
              selectedRegionPickupDates.reduce((acc, item) => {
                const date = new Date(item.dataodbioru);
                const month = date.toLocaleDateString("pl-PL", {
                  month: "long",
                  year: "numeric",
                });
                if (!acc[month]) acc[month] = [];
                acc[month].push(item);
                return acc;
              }, {})
            ).map(([month, items]) => (
              <div key={month} style={{ marginBottom: "35px" }}>
                {/** 🌙 MONTH HEADER WITH LINE ABOVE */}
                <div
                  style={{
                    borderTop: "3px solid #797979ff",
                    marginBottom: "15px",
                    paddingTop: "10px",
                    paddingBottom: "5px"
                  }}
                >
                  <h4
                    style={{
                      textTransform: "capitalize",
                      color: "#000000ff",
                      margin: 0,
                      fontSize: "1.2rem",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {month}
                  </h4>
                </div>
                  <Grid container spacing={2}>
                    {items.map((item, index) => {
                      const date = new Date(item.dataodbioru);
                      const wasteType = item.rodzajodpadu;

                      const getWasteColor = (type) => {
                        const lower = type.toLowerCase();
                        if (lower.includes("bio")) return "brown";
                        if (lower.includes("papier")) return "#2196f3";
                        if (lower.includes("szkło")) return "#4caf50";
                        if (lower.includes("plastik") || lower.includes("metale"))
                          return "yellow";
                        if (lower.includes("zmieszane")) return "#6d6d6dff";
                        return "#6a1b9a";
                      };
                      const color = getWasteColor(wasteType);

                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const daysLeft = daysUntil(item.dataodbioru);

                      let daysLabel = "";
                      if (daysLeft === 0) daysLabel = "Dziś!";
                      else if (daysLeft === 1) daysLabel = "Jutro";
                      else daysLabel = `${daysLeft} dni`;

                      return (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              height: "85px",
                              minWidth: "240px",
                              padding: "12px",
                              backgroundColor: "#d1d1d1ff",
                              borderLeft: `8px solid ${color}`,
                              borderRadius: "10px",
                              position: "relative", // for positioning the icon
                            }}
                          >
                            <div
                              style={{
                                fontWeight: "bold",
                                color: color,
                                textTransform: "capitalize",
                              }}
                            >
                              {date.toLocaleDateString("pl-PL", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                              })}
                            </div>

                            <div style={{ marginTop: "6px" }}>🗑️ {wasteType}</div>

                            <div
                              style={{
                                marginTop: "4px",
                                fontSize: "0.9rem",
                                fontWeight: daysLeft <= 1 ? "bold" : "normal",
                                color: daysLeft <= 1 ? "#d32f2f" : "#555",
                              }}
                            >
                              📅 {daysLabel} do odbioru
                            </div>
                            <div
                              style={{
                                position: "absolute",
                                bottom: "6px",
                                right: "8px",
                                opacity: 0.85,
                              }}
                            >
                              {getWasteIcon(wasteType)}
                            </div>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
              </div>
            ))}
          </div>
        ) : (
          selectedRegion &&
          selectedStreet && (
            <p>
              Brak dostępnych terminów odbioru odpadów dla wybranej ulicy i regionu.
            </p>
          )
        )}
      </Paper>
    )}





    </div>
  );
}

export default App;