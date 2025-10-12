import { Paper,Select,MenuItem,FormControl, InputLabel, Chip, Box,Typography } from "@mui/material";
import React, {useState, useEffect} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Comp1({strReg, selectedRegion, selectedStreet, onRegionChange, onStreetChange}) {

  const [regions, setRegions] = useState([]);
  const [regionStreets, setRegionStreets] = useState([]);
  const navigate = useNavigate();

  const formatRegion = (region) => {
  return region.replace(/([a-zA-Z]+)(\d+)/, "$1 $2");
  };

  useEffect(() => {
    const regionList = [...new Set(strReg.map(item => item.rejon))].sort();
    setRegions(regionList);
  }, [strReg]);

  useEffect(() => {
    const streets = strReg
      .filter(item => item.rejon === selectedRegion)
      .map(item => item.ulice);
    setRegionStreets(streets);
  }, [strReg,selectedRegion]);

  const handleStreetClick = (street) => {
    onStreetChange(street);
    navigate("/");
  };

  return (
  <div style={{padding: "5px 20px", border: "2px solid black", margin: "20px", backgroundColor: "#4C763B", borderRadius: "10px"}}>
    <h1>Wybierz rejon z listy. Pojawi się lista ulic do wyboru. Kliknij szukaną ulicę.</h1>
    <Paper elevation={4} style={{padding: "10px", margin: "10px", textAlign: "left"}}>
      <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
        <InputLabel id="region-select-label">Wybierz region</InputLabel>
          <Select
          labelId="region-select-label"
          label="Wybierz region"
          value={regions.includes(selectedRegion) ? selectedRegion : ""}
          onChange={(e) => onRegionChange(e.target.value)}
        >
          {regions.map((item, index) => (
            <MenuItem key={index} value={item}>{formatRegion(item)}</MenuItem>
          ))}

        </Select>
        
        <AnimatePresence>
          {selectedRegion && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Ulice dostępne w wybranym regionie:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  {regionStreets.map((street, index) => (
                    <Chip
                      key={index}
                      color="primary"
                      size="medium"
                      label={street}
                      onClick={() => handleStreetClick(street)}
                      // onClick={() => onStreetChange(street)}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

      </FormControl>
    </Paper>
  </div>
  )
}

export default Comp1;