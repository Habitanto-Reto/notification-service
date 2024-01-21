import formData from 'form-data';
import Mailgun from 'mailgun.js';
import * as process from "process";

export class MailSender {
    private mg;
    private readonly domain;

    constructor(apiKey: string, domain: string) {
        const mailgun = new Mailgun(formData);
        this.mg = mailgun.client({ username: 'api', key: apiKey });
        this.domain = domain;
    }

    async sendEmail(to: string, subject: string, text: string, html: string): Promise<void> {
        try {
            const messageData = {
                from: process.env.MAIL_FROM_SENDER_ADDRESS,
                to: [to],
                subject: subject,
                text: text,
                html: html
            };

            const response = await this.mg.messages.create(this.domain, messageData);
            console.log('Email sent:', response);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}
