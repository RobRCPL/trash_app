import { useState } from "react";
import { Construction, DeleteOutline, Inbox } from "@mui/icons-material";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import odpady from "../data/odpady.json";

function Comp3() {
  const [selectedOdpad, setSelectedOdpad] = useState(null);

  const getPojemnikColor = (pojemnik) => {
  const key = pojemnik.trim().toLowerCase();
  switch (key) {
    case 'bioodpady': return 'brown';
    case 'metale i tworzywa sztuczne': return '#ffeb3b';
    case 'papier': return '#2196f3';
    case 'szkło': return '#4caf50';
    case 'wielkogabaryty': return '#6a1b9a';
    case 'elektroodpady': return '#0b1f75ff';
    case 'zmieszane': return '#6d6d6d';
    default: return '#cccccc';
  }
}


  const getTextColor = (pojemnik) => {
    const lower = pojemnik.toLowerCase();
    return lower === 'metale i tworzywa sztuczne' || lower === 'baterie' ? '#000' : '#fff';
  }

  return (
    <Paper elevation={4} style={{ padding: '30px', maxWidth: '500px', margin: '40px auto', borderRadius: '15px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
        <Construction color="warning" fontSize="large" />
        <h2 style={{ margin: 0 }}>Gdzie wyrzucić odpad</h2>
      </div>

      <Autocomplete
        options={odpady}
        getOptionLabel={(option) => option.odpad}
        onChange={(event, newValue) => setSelectedOdpad(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Wybierz odpad"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              startAdornment: <DeleteOutline style={{ marginRight: '8px', color: '#555' }} />,
            }}
          />
        )}
        style={{ marginBottom: '20px' }}
        clearOnEscape
        autoHighlight
      />

      {!selectedOdpad && (
        <div style={{ fontSize: '14px', color: '#666', transition: 'opacity 0.3s' }}>
          Wybierz odpad z listy powyżej, aby zobaczyć szczegóły, do którego pojemnika go wyrzucić i jak go prawidłowo segregować.
        </div>
      )}

      {selectedOdpad && (
        <div style={{ marginTop: '20px', transition: 'opacity 0.3s', opacity: selectedOdpad ? 1 : 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '16px',
            fontWeight: '500',
            marginBottom: '10px'
          }}>
            <Inbox style={{ color: getPojemnikColor(selectedOdpad.pojemnikNaOdpad) }} />
            Wyrzuć do: 
            <span style={{
              background: `linear-gradient(135deg, ${getPojemnikColor(selectedOdpad.pojemnikNaOdpad)} 0%, ${getPojemnikColor(selectedOdpad.pojemnikNaOdpad)}CC 100%)`,
              color: getTextColor(selectedOdpad.pojemnikNaOdpad),
              padding: '6px 14px',
              borderRadius: '10px',
              fontWeight: '600',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              transition: 'all 0.3s'
            }}>
              {selectedOdpad.pojemnikNaOdpad}
            </span>
          </div>
          <div style={{
            fontSize: '16px',
            color: '#333',
            lineHeight: '1.6',
            backgroundColor: '#f5f5f5',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
            transition: 'all 0.3s'
          }}>
            {selectedOdpad.opis}
          </div>
        </div>
      )}
    </Paper>
  );
}

export default Comp3;
