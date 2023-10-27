import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const whatsapp_token = process.env.WHATSAPP_TOKEN;
const MY_PHONE_NUMBER = process.env.MY_PHONE_NUMBER;
const TEST_NUMBER_ID = process.env.WHATSAPP_TEST_PHONE_NUMBER_ID;

/**
 * Sandbox implementation of Whatsapp API service
 */

export enum MessageTemplate {
  SEND_LOW_CREDIT_ALERT = 'send_alert',
  NEW_CLASS_ALERT = 'class_created',
  DELETED_CLASS_ALERT = 'deleted_class',
  UPDATE_CLASS_ALERT = 'updated_class',
}
export class MessageService {
  constructor() {}

  public async sendWhatsappMessage(type?: MessageTemplate): Promise<void> {
    const url = `https://graph.facebook.com/v17.0/${TEST_NUMBER_ID}/messages`;

    if (!type) {
      type = MessageTemplate.SEND_LOW_CREDIT_ALERT;
    }

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: MY_PHONE_NUMBER,
      type: 'template',
      template: {
        name: type,
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
