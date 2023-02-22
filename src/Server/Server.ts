import { setupWebhookRoutes, WebhookRecievedCallback } from './Webhook';

export function createServer(port: number, webhookRecievedCallback: WebhookRecievedCallback): void {
    const { router, server } = require('0http')({
        defaultRoute: (_: any, res: any) => {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end('{"error":"route_not_found",message:"There route requested does not exist!"}');
        },
        // router: require('find-my-way')(),
        server: require('low-http-server')({
            cert_file_name: process.env["SSL_CERT_PATH"],
            key_file_name: process.env["SSL_KEY_PATH"],
            password: process.env["SSL_PASSWORD"]
        })
    });

    router.use(require('body-parser').json({
        limit: '5kb',
        strict: true,
        type: "application/json"
    }));
    
    router.get('/', (_:any, res:any) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end('{"name":"GiteaForwarder","version":"1.0.0","about":"Forwarding git data to various repositories!"}');
    })
    
    setupWebhookRoutes(router, webhookRecievedCallback);

    server.listen(port, () => {
        console.log("[WEB] Now listening on port " + port);
    });
}