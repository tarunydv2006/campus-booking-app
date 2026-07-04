import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const isGmailHost = (host = '') => host.toLowerCase().includes('gmail');

const normalizeAppPassword = (password = '') => password.replace(/\s+/g, '');

const formatSmtpError = (error) => ({
  name: error.name,
  message: error.message,
  code: error.code,
  command: error.command,
  responseCode: error.responseCode,
  response: error.response,
  stack: error.stack
});

const getSmtpConfig = () => {
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const rawSmtpPass = process.env.SMTP_PASS;
  const smtpPass = normalizeAppPassword(rawSmtpPass);
  const missingCredentials = [];

  if (!smtpUser) missingCredentials.push('SMTP_USER');
  if (!rawSmtpPass) missingCredentials.push('SMTP_PASS');
  if (!Number.isInteger(smtpPort) || smtpPort <= 0) {
    throw new Error(`Invalid SMTP_PORT "${process.env.SMTP_PORT}". Use 587 for STARTTLS or 465 for SSL.`);
  }

  if (missingCredentials.length > 0) {
    throw new Error(`Missing SMTP configuration: ${missingCredentials.join(', ')}`);
  }

  if (isGmailHost(smtpHost) && smtpPass.length !== 16) {
    console.warn(
      `Gmail SMTP is configured, but the normalized SMTP password length is ${smtpPass.length}. ` +
      'Gmail requires a 16-character App Password, not the account password.'
    );
  }

  return {
    host: smtpHost,
    port: smtpPort,
    secure: false,
    requireTLS: true,
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
    user: smtpUser,
    pass: smtpPass
  };
};

const getMailFrom = ({ user, host }) => {
  const configuredFrom = (process.env.SMTP_FROM || process.env.MAIL_FROM)?.trim();

  if (!configuredFrom) return `Smart Campus Booking <${user}>`;

  if (isGmailHost(host) && !configuredFrom.includes(user)) {
    console.warn(
      `SMTP_FROM (${configuredFrom}) does not match Gmail SMTP_USER (${user}). ` +
      'Using authenticated Gmail address as the sender.'
    );
    return `Smart Campus Booking <${user}>`;
  }

  return configuredFrom;
};

const createEmailTransporter = () => {
  const config = getSmtpConfig();
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: config.requireTLS,
    connectionTimeout: config.connectionTimeout,
    greetingTimeout: config.greetingTimeout,
    socketTimeout: config.socketTimeout,
    auth: {
      user: config.user,
      pass: config.pass
    }
  });

  return { config, transporter };
};

export const verifyEmailTransport = async () => {
  try {
    const { config, transporter } = createEmailTransporter();

    console.log(`SMTP startup verify: host=${config.host}, port=${config.port}, secure=${config.secure}, user=${config.user}, from=${getMailFrom(config)}`);
    await transporter.verify();
    console.log('SMTP ready: transporter verified successfully');
    return true;
  } catch (error) {
    console.error('SMTP startup verify failed:', formatSmtpError(error));
    return false;
  }
};

export const sendEmail = async ({ to, subject, html }) => {
  if (!to) throw new Error('Email recipient is required');
  if (!subject) throw new Error('Email subject is required');

  const { config, transporter } = createEmailTransporter();

  try {
    console.log(`Nodemailer sendMail starting: to=${to}, host=${config.host}, port=${config.port}, secure=${config.secure}, user=${config.user}, from=${getMailFrom(config)}`);
    const info = await transporter.sendMail({
      from: getMailFrom(config),
      to,
      subject,
      html
    });

    console.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Nodemailer sendMail failed:', formatSmtpError(error));
    throw error;
  }
};
