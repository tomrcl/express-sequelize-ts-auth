import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';

dotenv.config();

const mailerHost: string = process.env.MAILER_HOST as string;
const mailerPort: number = process.env.MAILER_PORT as unknown as number;
const mailerUser: string = process.env.MAILER_USER as string;
const mailerPassword: string = process.env.MAILER_PASSWORD as string;
const mailerSender: string = process.env.MAILER_SENDER as string;

const transport = nodemailer.createTransport({
  host: mailerHost,
  port: mailerPort,
  secure: mailerPort === 465,
  auth: {
    user: mailerUser,
    pass: mailerPassword,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

const registerMessage = (
  email: string,
  name: string,
  confirmationUrl: string,
) => {
  return {
    from: mailerSender,
    to: email,
    subject: 'Inscription à confirmer',
    text: 'Hello, This is amazing.',
    html: `<h2>Bonjour ${name},</h2><br/>Merci de valider votre inscription en cliquant sur le lien suivant: ${confirmationUrl}`,
  };
};

export const sendMail = (email: string, name: string = '') => {
  transport.sendMail(
    registerMessage(email, name, 'http://www.qwant.fr'),
    (err: any, info: any) => {
      if (err) {
        console.error(err);
      } else {
        console.log(info);
      }
    },
  );
};
