import { App } from "./app";
import { kafkaConsumer } from "./kafka";
import sendMail from "./services/mailer";
import { emailAddress } from "../config/mailer.json"

handleMessages(['new-users', 'forgot-password', 'new-bet', 'new-bet-by-week', 'new-bet-new-users', 'new-bet-admin-report'])
new App().server.listen(3000, () => console.log('Listening on port 3000'));

async function handleMessages(topics: string[]): Promise<void> {
  await kafkaConsumer.connect()
  await kafkaConsumer.subscribe({ topics })
  await kafkaConsumer.run({
    eachMessage: async ({ topic, message }) => {
      const ctxObject = JSON.parse(message.value!.toString())
      let subject: string = 'default subject', template: string = 'default template';
      switch (topic) {
        case 'new-users':
          subject = 'Welcome to Bets System!';
          template = 'welcome';
          break;
        case 'forgot-password':
          subject = 'Password Recovery Token';
          template = 'recover';
          break;
        case 'new-bet':
          subject = 'Congratulations for your new bet!';
          template = 'new_bet';
          break;
        case 'new-bet-by-week':
          subject = 'We miss you!';
          template = 'new_bet_reminder_by_week';
          break;
        case 'new-bet-new-users':
          subject = 'Start betting!';
          template = 'new_bet_reminder_for_new_users';
          break;
        case 'new-bet-admin-report':
          subject = 'Admin betting report';
          template = 'new_bet_admin_report';
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