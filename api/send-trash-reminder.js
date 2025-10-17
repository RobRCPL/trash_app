import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0]; // np. "2025-10-09"

    // Wczytaj lokalny plik JSON (z folderu public lub src/data)
    const filePath = path.join(process.cwd(), "src", "data", "datyodbioru.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Znajdź, które rejony mają odbiór jutro
    const odbioryJutro = data.filter(
      (entry) => entry.dataodbioru === dateStr
    );

    if (odbioryJutro.length === 0) {
      console.log("Brak odbiorów jutro");
      return res.status(200).json({ message: "Brak odbiorów jutro" });
    }

    // Konfiguracja Gmaila
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Grupujemy według rejonu
    const rejony = [...new Set(odbioryJutro.map((o) => o.rejon))];

    for (const rejon of rejony) {
      const odpady = odbioryJutro
        .filter((o) => o.rejon === rejon)
        .map((o) => o.rodzajodpadu)
        .join(", ");

      const envName = `${rejon.toUpperCase()}_EMAILS`; // np. "REJON1_EMAILS"
      const recipients = process.env[envName];

      if (!recipients) {
        console.warn(`Brak odbiorców dla ${rejon}`);
        continue;
      }

      const mailList = recipients.split(",");

      for (const to of mailList) {
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to,
          subject: `📦 Odbiór odpadów jutro (${rejon})`,
          html: `
            <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                <table style="width: 100%; border: none; padding: 20px; background-color: #f4f4f4;">
                  <tr>
                    <td style="background-color: #3a8dff; color: white; padding: 10px 20px; text-align: center; font-size: 20px;">
                      📦 Przypomnienie: Odbiór odpadów
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px; background-color: white; border: 1px solid #ddd;">
                      <h2 style="color: #333;">Odbiór odpadów w regionie ${rejon}</h2>
                      <p style="color: #555; font-size: 16px;">
                        <strong>Data:</strong> ${dateStr}<br />
                        <strong>Rodzaj odpadów:</strong>
                        <div style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: ${odpady.split(', ').length > 1 ? '20px' : '10px'};">
                          ${odpady.split(', ').map((odpad) => {
                          const chipColor = getColorForWaste(odpad);
                          const fontColor = odpad === 'Metale i Tworzywa' ? 'black' : 'white'; // Apply black font for 'Metale i Tworzywa'
                          return `<span style="background-color: ${chipColor}; color: ${fontColor}; padding: 5px 10px; border-radius: 15px; font-size: 14px; text-transform: capitalize;">${odpad}</span>`;
                        }).join('')}
                        </div>
                      </p>
                      <p style="color: #555; font-size: 16px;">
                        Prosimy o wystawienie odpadów przed 7:00 rano.
                      </p>
                      <p style="font-size: 14px; color: #888;">Jeśli masz pytania, skontaktuj się z administratorem.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #3a8dff; color: white; padding: 10px; text-align: center; font-size: 12px;">
                      Dziękujemy, że dbasz o czystość w naszym regionie! 🌍
                    </td>
                  </tr>
                </table>
              </body>
            </html>
          `,
        });

        // Function to assign color to each waste type
        function getColorForWaste(odpad) {
          switch (odpad) {
            case 'Papier':
              return '#2196f3'; // Yellow for paper
            case 'Metale i Tworzywa':
              return 'yellow'; // Blue for plastic
            case 'Szkło':
              return '#4caf50'; // Green for glass
            case 'Bioodpady':
              return 'brown'; // Red for organic waste (bio)
            case 'Zmieszane':
              return '#6d6d6dff'; // Grey for mixed waste
            case 'Gabaryty':
              return '#6a1b9a';
            default:
              return '#9e9e9e'; // Default grey if no match
          }
        }
      }

      console.log(`Wysłano przypomnienia dla ${rejon}: ${odpady}`);
    }

    res.status(200).json({ success: true, message: "Wiadomości wysłane" });
  } catch (error) {
    console.error("Błąd:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
