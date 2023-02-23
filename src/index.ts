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
import { Forward } from './Forward/Forward';
import { createForward, getForwardByWebhook } from './Forward/ForwardManager';
import { createServer } from './Server/Server';
import { env, cwd } from 'process';
import { cloneRepo, changeCommitAuthors, push, insertToReadme } from './Git/GitManager';
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
            if (recipientData.hasOwnProperty("modifyReadme")) {
                recipient.insertToReadme = !!recipientData.modifyReadme;
                console.log("Readme will be modified on recipient: " + recipient.humanName||recipient.url);
            }
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

createServer(parseInt(env["PORT"]||"3000"), async (webhookId: string, webhookData: any) => {
    const forward: Forward|null = getForwardByWebhook(webhookId);
    if (forward == null) return;
    if (!webhookData.hasOwnProperty("repository")) return;
    const url: any = webhookData.repository.ssh_url || webhookData.repository.clone_url || webhookData.repository.html_url;
    if (typeof url !== "string" || forward.origin !== url) {
        console.log("[VAL] Invalid webhook origin!");
        return;
    }
    console.log("[VAL] Validated " + url);
    const outputDir = cwd() + "/git_output_" + Math.random().toString(32).substring(2,8) + "/";
    for (const sendTo of forward.getRecipients()) {
        await cloneRepo(forward.origin, outputDir);
        await changeCommitAuthors(sendTo, outputDir);
        if (sendTo.insertToReadme) await insertToReadme(webhookData.repository.full_name, webhookData.repository.html_url, outputDir);
        await push(sendTo.url, outputDir);
        rmSync(outputDir, {
            recursive: true,
            force: true
        });
    }
});