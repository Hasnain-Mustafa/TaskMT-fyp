"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNewsletterEmail = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "taskmt.site@gmail.com", // Replace with your email
        pass: "dmhk ukke dixl rymi", // Replace with your email password
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
    },
});
function sendNewsletterEmail(to, subject, text) {
    const mailOptions = {
        from: "taskmt.site@gmail.com",
        to: to,
        subject: subject,
        text: text,
    };
    exports.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email:", error);
        }
        else {
            console.log(info.envelope.to);
        }
    });
}
exports.sendNewsletterEmail = sendNewsletterEmail;
