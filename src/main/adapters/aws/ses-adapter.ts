import { SES } from 'aws-sdk';

import { MessengerGateway } from '../../../core/domain/gateways';

export class SESAdapter implements MessengerGateway {
  private readonly ses = new SES();

  constructor(private readonly source: string) {}

  async sendMessage(
    email: string,
    title: string,
    message: string,
  ): Promise<boolean> {
    const params = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Text: {
            Charset: 'UTF-8',
            Data: message,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: title,
        },
      },
      Source: this.source,
    };

    try {
      await this.ses.sendEmail(params).promise();
      return true;
    } catch (error) {
      console.error('Error sending email: ', error);
      return false;
    }
  }
}
