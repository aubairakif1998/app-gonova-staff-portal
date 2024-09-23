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

    const mailOptions = {
        from: '"no-reply@gonovatec.com>', // sender address
        to: email,
        subject: 'Activate Your Account', // Subject line
        html: `
           <p>Hello ${details.companyName},</p>
            <p>Please click the following link to activate your account and set your password:</p>
            <a href="${activationUrl}">${activationUrl}</a>
            <p>This link will expire in 24 hours.</p>
            <p><strong>Your Details:</strong></p>
            <ul>
                <li>Email: ${details.email}</li>
                <li>City: ${details.city}</li>
                <li>Location Address: ${details.locationAddress}</li>
                <li>Phone Number: ${details.phoneNumber}</li>
                <li>ZIP: ${details.zip}</li>
            </ul>
        `, // HTML body content
    };
    // Send email
    await transporter.sendMail(mailOptions);
};
export default sendActivationEmail;