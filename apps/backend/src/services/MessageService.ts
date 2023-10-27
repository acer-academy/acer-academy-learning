import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const whatsapp_token = process.env.WHATSAPP_TOKEN;
const MY_PHONE_NUMBER = process.env.MY_PHONE_NUMBER;
const TEST_NUMBER_ID = process.env.WHATSAPP_TEST_PHONE_NUMBER_ID;

export class MessageService {
  constructor() {}

  public async sendWhatsappMessage(): Promise<void> {
    const url = `https://graph.facebook.com/v17.0/${TEST_NUMBER_ID}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: MY_PHONE_NUMBER,
      type: 'template',
      template: {
        name: 'send_alert',
        language: {
          code: 'en',
        },
      },
    };

    const headers = {
      Authorization: `Bearer ${whatsapp_token}`,
      'Content-Type': 'application/json',
    };

    axios
      .post(url, payload, {
        headers: headers,
      })
      .then(function (response) {
        console.log('Whatsapp message sent!');
      })
      .catch(function (error) {
        console.log(error);
      });
    return;
  }
}
