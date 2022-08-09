import { App } from "./app";
import { kafkaConsumer } from "./kafka";
import sendMail, { formatAmountToBRL } from "./services/mailer";
import { emailAddress } from "../config/mailer.json"
import dotenv from "dotenv"

dotenv.config()

handleMessages(['new-clients', 'forgot-password', 'new-pix-sent', 'new-pix-received'])
new App().server.listen(3000, () => console.log('Listening on port 3000'));

async function handleMessages(topics: string[]): Promise<void> {
  await kafkaConsumer.connect()
  await kafkaConsumer.subscribe({ topics })
  await kafkaConsumer.run({
    eachMessage: async ({ topic, message }) => {
      const ctxObject = JSON.parse(message.value!.toString())
      let subject: string = 'default subject', template: string = 'default template';
      switch (topic) {
        case 'new-clients':
          if(ctxObject.status === 'approved') {
            subject = 'Welcome to Luby Cash!';
            template = 'welcome';
          } else {
            subject = 'You are not eligible';
            template = 'not-eligible';
          }
          break;
        case 'forgot-password':
          subject = 'Password Recovery Token';
          template = 'recover';
          break;
        case 'new-pix-sent':
          ctxObject.value = formatAmountToBRL(ctxObject.value)
          subject = 'You sent a Pix'
          template = 'new-pix-sent'
          break;
        case 'new-pix-received':
          ctxObject.value = formatAmountToBRL(ctxObject.value)
          template = 'new-pix-received'  
          subject = 'You received a Pix'
          break;
      }    
      setTimeout(() => sendMail({ 
        to: ctxObject.email,
        from: emailAddress,
        context: ctxObject,
        subject,
        template
       }), Math.random())
    },
  })
}