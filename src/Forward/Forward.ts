import { Recipient } from './Recipient'

export class Forward {

    public readonly webhook: string;
    public readonly origin: string;
    private readonly recipients: Recipient[] = [];

    constructor(webhookId: string, origin: string) {
        this.webhook = webhookId;
        this.origin = origin;
    }

    public createRecipient(url: string, humanName: string|undefined):Recipient {
        const recipient = new Recipient(url, humanName);
        this.recipients.push(recipient);
        return recipient;
    }

    public getRecipients(): Recipient[] {
        return this.recipients;
    }

}