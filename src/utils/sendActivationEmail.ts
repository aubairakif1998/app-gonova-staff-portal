// utils/sendActivationEmail.ts

import nodemailer from 'nodemailer';

const sendActivationEmail = async (email: string, activationUrl: string, details: any) => {
    // Create transporter object using Mailtrap SMTP
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: Number(process.env.MAILTRAP_PORT),
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS,
        },
    });

    // Format details for the email
    const detailsHtml = `
        <h3>Your Registration Details</h3>
        <ul>
            <li><strong>Email:</strong> ${details.email}</li>
            <li><strong>Company Name:</strong> ${details.companyName}</li>
            <li><strong>City:</strong> ${details.city}</li>
            <li><strong>Location Address:</strong> ${details.locationAddress}</li>
            <li><strong>Phone Number:</strong> ${details.phoneNumber}</li>
            <li><strong>ZIP Code:</strong> ${details.zip}</li>
        </ul>
    `;

    const mailOptions = {
        from: '"Your Company Name" <no-reply@yourcompany.com>', // sender address
        to: email, // recipient's email
        subject: 'Activate Your Account', // Subject line
        html: `
            <p>Please click the following link to activate your account and set your password:</p>
            <a href="${activationUrl}">${activationUrl}</a>
            <p>This link will expire in 24 hours.</p>
            ${detailsHtml}
        `, // HTML body content
    };

    // Send email
    await transporter.sendMail(mailOptions);
};

export default sendActivationEmail;
