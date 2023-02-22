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
export type WebhookRecievedCallback = (webhookId: string, webhook: Promise<any>) => void;

export function setupWebhookRoutes(router:any, webhookRecievedCallback:WebhookRecievedCallback):void {
    
    router.post('/webhook/:webhook', (req: any, res: any) => {
        const webhookId = req.params.webhook;
        console.log("[WEB] Recieved webhook " + webhookId);
        webhookRecievedCallback(webhookId, res.body);
        res.statusCode = 200;
        res.end();
    });
}