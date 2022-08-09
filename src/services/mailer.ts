import nodemailer  from 'nodemailer';
import handlebars from 'handlebars';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { host, port, user, pass }  from '../../config/mailer.json';

interface SendMailParams {
  to: string;
  from: string;
  subject: string;
  context: any;
  template: string;
}

const readFile = promisify(fs.readFile)
const mailer = nodemailer.createTransport({
  host, port, auth: { user, pass } 
});

const sendMail = async (params: SendMailParams): Promise<void> => {
    const html = await readFile(path.resolve('./src/resources/views/mail', `${params.template}.html`), 'utf8');
    const template = handlebars.compile(html);
    const htmlToSend = template(params.context);
    const mailOptions = {
        from: params.from,
        to : params.to,
        subject : params.subject,
        html : htmlToSend
    };
    mailer.sendMail(mailOptions, (error) => {
        if (error) console.error(error);
    });
};

export function formatAmountToBRL(amount: number) {
  let formattedNumber = `R$ ${amount}`.replace('.', ',');
  if(formattedNumber.indexOf(',') === -1)
    formattedNumber += ',00'; 
  else if(formattedNumber.split(',')[1].length === 1)
    formattedNumber += '0';
  return formattedNumber;
}

export default sendMail;

