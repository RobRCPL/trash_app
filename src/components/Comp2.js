import { Paper,Select,MenuItem,FormControl, InputLabel } from "@mui/material";
import React, {useState, useEffect} from "react";

function Comp2({strReg, selectedStreet, onRegionChange, onStreetChange }) {

  const [streets, setStreets] = useState([]);

  useEffect(() => {
    const streetList = [...new Set(strReg.map(item => item.ulice))].sort();
    setStreets(streetList);
  }, [strReg]);

  useEffect(() => {
  const selected = strReg.find(item => item.ulice === selectedStreet);
  if (selected) {
    // Assign region automatically, but don't clear street
    onRegionChange(selected.rejon, false);
  }
}, [selectedStreet, strReg, onRegionChange]);


  return (

    <div style={{padding: "5px 20px", border: "2px solid black", margin: "20px", backgroundColor: "#6575ce", borderRadius: "10px"}}>
      <h1>Wybierz ulicę z listy. Rejon zostanie automatycznie przypisany</h1>
      <Paper elevation={4} style={{padding: "10px", margin: "10px", textAlign: "left"}}>
          <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
            <InputLabel id="street-select-label">Wybierz ulicę</InputLabel>
              <Select
              labelId="street-select-label"
              label="Wybierz ulicę"
              value={selectedStreet}
              onChange={(e) => onStreetChange(e.target.value)}
            >
              {streets.map((item) => (
    <MenuItem
      key={item}
      value={item}
      selected={item === selectedStreet} // optional highlight
    >
      {item}
    </MenuItem>
  ))}
            </Select>
          </FormControl>
        </Paper>
    </div>
  )
}   

export default Comp2;