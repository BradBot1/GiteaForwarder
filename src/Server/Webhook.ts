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