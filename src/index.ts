import { Forward } from './Forward/Forward';
import { createForward, getForwardByWebhook } from './Forward/ForwardManager';
import { createServer } from './Server/Server';
import { env, cwd } from 'process';
import { cloneRepo, changeCommitAuthors, push } from './Git/GitManager';
import { rmSync, existsSync, readFileSync } from 'fs'

var dataToLoad: string;

if (env.hasOwnProperty("DATA")) {
    dataToLoad = env["DATA"]||"";
} else if (existsSync("./data.json")) {
    dataToLoad = readFileSync("./data.json").toString();
} else {
    console.error("Failed to find any data to load!");
    process.exit(1);
}

var parsedData: any;

try {
    parsedData = JSON.parse(dataToLoad);
} catch (e) {
    console.error("Failed to parse the provided data!");
    process.exit(1);
}

if (!Array.isArray(parsedData)) parsedData = [parsedData];

for (const forwardData of parsedData) {
    if (!forwardData.hasOwnProperty("origin")) {
        console.error("No origin of forward!");
        continue;
    }
    const forward = createForward(forwardData.origin, forwardData.webhook);
    console.log("Created forward on webhook: " + forward.webhook);
    if (forwardData.hasOwnProperty("recipients")) {
        for (const recipientData of forwardData.recipients) {
            if (!recipientData.hasOwnProperty("url")) {
                console.error("No url provided for recipient");
                continue;
            }
            const recipient = forward.createRecipient(recipientData.url, recipientData.humanName);
            if (!recipientData.hasOwnProperty("authors")) {
                console.error("No authors provided for recipient: " + recipient.humanName||recipient.url);
                continue;
            }
            for (const author of recipientData.authors) {
                if (!author.hasOwnProperty("old")) {
                    console.error("No old email provided for recipient: " + author.humanName||recipient.url);
                    continue;
                }
                if (!author.hasOwnProperty("email")) {
                    console.error("No new email provided for recipient: " + author.humanName||recipient.url);
                    continue;
                }
                if (!author.hasOwnProperty("name")) {
                    console.error("No new name provided for recipient: " + author.humanName||recipient.url);
                    continue;
                }
                recipient.setAuthor(author.old, author.name, author.email);
            }
        }
    } else {
        console.log("No recipients found");
    }
}

createServer(parseInt(env["PORT"]||"3000"), async (webhookId: string, webhook: Promise<any>) => {
    const forward: Forward|null = getForwardByWebhook(webhookId);
    if (forward == null) return;
    const webhookData: any = await webhook;
    if (!webhookData.hasOwnProperty("repository")) return;
    const url: any = webhookData.repository.clone_url || webhookData.repository.ssh_url || webhookData.repository.html_url;
    if (typeof url !== "string") return;
    if (forward.origin !== url) {
        console.log("[VAL] Invalid webhook origin!");
        return;
    }
    console.log("[VAL] Validated " + url);
    const outputDir = cwd() + "/git_output_" + Math.random().toString(32).substring(2,8) + "/";
    for (const sendTo of forward.getRecipients()) {
        await cloneRepo(forward.origin, outputDir);
        await changeCommitAuthors(sendTo, outputDir);
        await push(sendTo.url, outputDir);
        rmSync(outputDir, {
            recursive: true,
            force: true
        });
    }
});