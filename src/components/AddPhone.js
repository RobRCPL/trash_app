import React, { useRef } from "react";
import { Chip, Paper } from "@mui/material";
import emailjs from "emailjs-com";

function AddPhone({ selectedRegion, selectedStreet }) {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_j94p59w",
        "template_4q6z7po",
        form.current,
        "rQ-LXyRM5uaMmvFVZ"
      )
      .then(
        () => {
          alert("✅ Wiadomość wysłana!");
          form.current.reset();
        },
        (error) => {
          alert("❌ Błąd: " + error.text);
        }
      );
  };

  // 🔹 Warunkowe sprawdzenie
  if (!selectedStreet || !selectedRegion) {
    return (
      <Paper
        elevation={4}
        style={{ padding: "20px", margin: "20px auto", maxWidth: "500px" }}
      >
        <p>Proszę wybrać ulicę i rejon, aby móc ustawić powiadomienia.</p>
      </Paper>
    );
  }

  return (
    <div>
      <Paper
        elevation={4}
        style={{
          padding: "20px",
          margin: "20px auto",
          textAlign: "left",
          maxWidth: "500px",
        }}
      >
        <h2>Dodaj email do bazy</h2>
        <form ref={form} onSubmit={sendEmail}>
          <label>Imię lub cokolwiek</label>
          <br />
          <input type="text" name="user_name" required />
          <br />

          <label>Email</label>
          <br />
          <input type="text" name="user_phone" required />
          <br />

          <label>Ulica</label>
          <br />
          <Chip label={selectedStreet} color="success" sx={{borderRadius: "5px"}}/>
          <input type="hidden" name="selected_street" value={selectedStreet} />
          <br />

          <label>Rejon</label>
          <br />
          <Chip label={selectedRegion} color="success" sx={{borderRadius: "5px"}}/>
          <input type="hidden" name="selected_region" value={selectedRegion} />
          <br />

          <label>Opcjonalna wiadomość</label>
          <br />
          <textarea name="message" />
          <br />

          <input
            type="hidden"
            name="date"
            value={new Date().toLocaleString("pl-PL", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          />

          <input
            type="submit"
            value="Wyślij"
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          />
        </form>

        <p style={{ marginTop: "10px", fontSize: "0.9em" }}>
          Po wysłaniu formularza, email zostanie dodany do bazy danych. Powiadomienia zaczną przychodzić po zatwierdzeniu przez administratora.
        </p>
      </Paper>
    </div>
  );
}

export default AddPhone;
