import nodemailer from "nodemailer";

export default async function handler(req, res) {
  try {
    // Tworzymy transporter Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Pobieramy numery z ENV i zamieniamy na tablicę
    const recipients = process.env.SMS_RECIPIENTS.split(",").map(r => r.trim());

    // Wiadomość — z body lub domyślna
    const message =
      req.body?.message ||
      `Raport dnia ${new Date().toLocaleDateString("pl-PL")}: wszystko działa ✅`;

    // Wysyłamy SMS do każdego numeru z listy
    for (const to of recipients) {
      console.log(`Wysyłam SMS do: ${to}`);
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to,
        subject: "",
        text: message,
      });
    }

    res.status(200).json({
      success: true,
      message: `SMS-y wysłane do ${recipients.length} numerów`,
    });
  } catch (error) {
    console.error("Błąd wysyłania SMS:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
