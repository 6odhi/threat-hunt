const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "cyber09cyber09@gmail.com",
        pass: "kjyj qppr khqr hirv",
      },
    });

    await transporter.sendMail({
      from: email,
      to: "cyber09cyber09@gmail.com",
      subject: `New Contact Message from ${name}`,
      html: `
        <h3>New Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    res.json({ message: "Email sent successfully." });

  } catch (err) {
    res.status(500).json({ message: "Email failed to send." });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});