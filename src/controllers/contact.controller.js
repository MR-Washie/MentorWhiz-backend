import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();


export const contactForm = async (req, res) => {
    const data = req.body;
    // const files = req.files; 
  try {
   
   
    for (let key in data) {
        if(!data[key]) {
          return res.status(400).json({ message: `${key} is required` });
        }
    }
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: ` "MentorWhiz Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: ` Help: ${data.subject}`,
      text: `
        Full Name: ${data.fullName}
        College Name: ${data.collegeName}
        Email: ${data.email}
        Mobile No: ${data.mobileNo}
        Message : ${data.message}`
    };
    console.log(mailOptions);

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Contact Form submitted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error sending email." });
  }
}