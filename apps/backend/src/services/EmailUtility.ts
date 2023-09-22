// emailUtility.ts
import nodemailer from 'nodemailer';

class EmailUtility {
  async sendPasswordResetEmail(recipientEmail: string, resetLink: string) {
    // Create a transporter using Gmail's SMTP settings
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'no.reply.acer.academy@gmail.com', // replace with your Gmail email
        pass: 'mxir mrho bkzi emxq', // replace with your App Password
      },
    });

    // Email message options
    const mailOptions = {
      from: 'Acer Academy <no.reply.acer.academy@gmail.com>', // sender address
      to: recipientEmail, // recipient
      subject: 'Password Reset Request',
      text: `You have requested to reset your password. Please click on the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`,
      html: `<p>You have requested to reset your password. Please click on the link below to reset your password:</p><a href="${resetLink}">Reset Password</a><p>If you did not request this, please ignore this email.</p>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
  }
}

export default new EmailUtility();
