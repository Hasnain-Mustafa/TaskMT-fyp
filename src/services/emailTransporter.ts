import nodemailer from 'nodemailer';

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'taskmt.site@gmail.com',  // Replace with your email
    pass: 'dmhk ukke dixl rymi'  // Replace with your email password
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
});

export function sendNewsletterEmail(to: string, subject: string, text: string): void {
  const mailOptions: MailOptions = {
    from: 'taskmt.site@gmail.com',
    to: to,
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log(info.envelope.to);
    }
  });
}
