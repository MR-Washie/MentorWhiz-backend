import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();


export const mentorRegister = async (req, res) => {
    const data = req.body;
    const files = req.files;

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
      from: ` "MentorWhiz" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New Mentor Signup: ${data.fullName}`,
      text: `
        Full Name: ${data.fullName}
        Email: ${data.email}
        Mobile No: ${data.mobileNo}
        Gender: ${data.gender}
        Mentor Type: ${data.mentorType}
        LinkedIn: ${data.linkedinId}
        Profession: ${data.profession}
        Joining Year: ${data.joiningYear}
        City: ${data.city}
        Language: ${data.language}`,
      attachments: [
        {
          filename: files.identityProof[0].originalname,
          path: files.identityProof[0].path,
        },
        {
          filename: files.companyProof[0].originalname,
          path: files.companyProof[0].path,
        },
      ],
    };
    
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Form submitted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error sending email." });
  }
}

