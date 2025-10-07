import nodemailer from "nodemailer";

export default async function handler(req, res) {
  try {
    // Tworzymy transporter Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,          // Twój Gmail
        pass: process.env.GMAIL_APP_PASSWORD,  // Hasło aplikacji Gmail
      },
    });

    // Pobieramy numer(y) z ENV (Vercel)
    const recipients = process.env.SMS_RECIPIENTS.split(",");

    // Treść SMS, jeśli frontend przesłał, używamy jej, inaczej domyślna
    const message = req.body?.message || `Raport dnia ${new Date().toLocaleDateString("pl-PL")}: wszystko działa ✅`;

    // Wysyłamy SMS do każdego numeru
    for (const to of recipients) {
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to,
        subject: "",  // pozostaw pusty, bramki SMS nie obsługują tematu
        text: message,
      });
    }

    res.status(200).json({ success: true, message: "SMS-y wysłane do wszystkich numerów" });
  } catch (error) {
    console.error("Błąd wysyłania SMS:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
