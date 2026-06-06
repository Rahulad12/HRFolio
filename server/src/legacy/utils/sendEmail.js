import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => {
    console.log(to, subject, html);
    // Use your SMTP credentials or Gmail OAuth
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"HR" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
};

export default sendEmail;
