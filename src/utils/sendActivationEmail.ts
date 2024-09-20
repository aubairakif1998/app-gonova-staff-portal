// utils/sendActivationEmail.ts

import nodemailer from 'nodemailer';

const sendActivationEmail = async (email: string, activationUrl: string) => {
    // Create transporter object using Mailtrap SMTP
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: Number(process.env.MAILTRAP_PORT),
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS,
        },
    });

    const mailOptions = {
        from: '"Your Company Name" <no-reply@yourcompany.com>', // sender address
        to: email, // recipient's email
        subject: 'Activate Your Account', // Subject line
        html: `
            <p>Please click the following link to activate your account and set your password:</p>
            <a href="${activationUrl}">${activationUrl}</a>
            <p>This link will expire in 24 hours.</p>
        `, // HTML body content
    };

    // Send email
    await transporter.sendMail(mailOptions);
};

export default sendActivationEmail;
