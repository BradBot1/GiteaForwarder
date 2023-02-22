import { Forward } from './Forward';

const known_forwards: Forward[] = [];
/**
 * Generates a 32 character long random string
*/
function generateRandomWebhookId(): string {
    return (Math.random().toString(36).substring(2)
    +Math.random().toString(36).substring(2)
    +Math.random().toString(36).substring(2)
    +Math.random().toString(36).substring(2, 2));
}

export function getForwardByWebhook(webhookId: string): Forward|null {
    for (var forward of known_forwards) 
        if (forward.webhook === webhookId) 
            return forward;
    return null;
};

export function getForwards(): Forward[] {
    return known_forwards;
};

export function createForward(origin: string, webhook: string|undefined): Forward {
    if (webhook === undefined) {
        do {
            webhook = generateRandomWebhookId();
        } while (getForwardByWebhook(webhook) != null);
    }
    return new Forward(webhook, origin);
};