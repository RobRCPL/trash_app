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
    const filePath = path.join(process.cwd(), "datyodbioru.json");
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
          text: `Jutro (${dateStr}) odbiór: ${odpady} w ${rejon}.`,
        });
      }

      console.log(`Wysłano przypomnienia dla ${rejon}: ${odpady}`);
    }

    res.status(200).json({ success: true, message: "Wiadomości wysłane" });
  } catch (error) {
    console.error("Błąd:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
