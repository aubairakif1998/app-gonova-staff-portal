import nodemailer from 'nodemailer';

const sendActivationEmail = async (email: string, activationUrl: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Activate your account',
        html: `<p>Please click the following link to activate your account and set your password:</p>
               <a href="${activationUrl}">${activationUrl}</a>
               <p>This link will expire in 24 hours.</p>`
    };

    await transporter.sendMail(mailOptions);
};

export default sendActivationEmail;
