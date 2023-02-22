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