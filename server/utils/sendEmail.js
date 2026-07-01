import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

export const sendEmail = async ({ to, subject, html }) => {
  const missingCredentials = ['SMTP_USER', 'SMTP_PASS'].filter((key) => !process.env[key]);
  if (missingCredentials.length > 0) {
    console.log(`Email skipped. Missing SMTP configuration: ${missingCredentials.join(', ')}`);
    return;
  }

  if (!process.env.SMTP_HOST) {
    console.warn('SMTP_HOST missing; using Gmail default smtp.gmail.com');
  }

  if (!process.env.SMTP_PORT) {
    console.warn('SMTP_PORT missing; using Gmail default 587');
  }

  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS.replace(/\s+/g, '');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || `Smart Campus Booking <${smtpUser}>`,
      to,
      subject,
      html
    });

    console.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Nodemailer send error:', error);
    throw error;
  }
};
