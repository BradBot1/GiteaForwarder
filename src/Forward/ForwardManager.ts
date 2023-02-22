/*
    Copyright 2022 BradBot_1

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
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