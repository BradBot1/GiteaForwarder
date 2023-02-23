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
import { Forward } from '../Forward/Forward'
import { simpleGit as Git } from 'simple-git';
import { GitAuthor } from './GitAuthor';
import { Recipient } from '../Forward/Recipient';
import { execSync } from 'child_process';
import { writeFileSync, existsSync, readFileSync } from 'fs'

export async function cloneRepo(repo: string, out: string = __dirname): Promise<void> {
    try {
        await Git().clone(repo, out);
    } catch (error) {
        console.log(error);
        await Git(out).pull();
    }
}

export async function push(repo: string, out: string = __dirname): Promise<void> {
    const git = Git(out);
    git.addRemote("fumo", repo);
    await git.push(["fumo", "--force"]);
}

export async function getCommitAuthors(out: string = __dirname): Promise<string[]> {
    const git = Git(out);
    const oldAuthors: Set<string> = new Set<string>();
    for (const commit of (await git.log()).all) 
        oldAuthors.add(commit.author_email);
    return Array.from(oldAuthors);
}

const _changeCommitAuthorsReplace: string = `#!/bin/sh

git filter-branch --env-filter '

an="$GIT_AUTHOR_NAME"
am="$GIT_AUTHOR_EMAIL"
cn="$GIT_COMMITTER_NAME"
cm="$GIT_COMMITTER_EMAIL"

echo $GIT_COMMITTER_EMAIL

if [ "$GIT_COMMITTER_EMAIL" = "OLD_EMAIL" ]
then
    cn="NEW_NAME"
    cm="NEW_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "OLD_EMAIL" ]
then
    an="NEW_NAME"
    am="NEW_EMAIL"
fi

export GIT_AUTHOR_NAME="$an"
export GIT_AUTHOR_EMAIL="$am"
export GIT_COMMITTER_NAME="$cn"
export GIT_COMMITTER_EMAIL="$cm"
'`;


export async function changeCommitAuthors(recipient: Recipient, out: string = __dirname): Promise<void> {
    for (const author of await getCommitAuthors(out)) {
        const newAuthor: GitAuthor|undefined = recipient.authorMap.get(author);
        if (newAuthor === undefined) continue;
        writeFileSync(out + "git_change.sh", _changeCommitAuthorsReplace.replace(/OLD_EMAIL/g, author).replace(/NEW_NAME/g, newAuthor.name).replace(/NEW_EMAIL/g, newAuthor.email));
        execSync("/bin/sh " + out + "git_change.sh", {
            cwd: out
        });
    }
}

export async function insertToReadme(projectName: string, projectLink: string, out: string = __dirname): Promise<void> {
    const git = Git(out).addConfig('user.email', process.env['README_EMAIL']||"donotreply@bb1.fun").addConfig('user.name', process.env['README_NAME']||"GiteaForwarder");
    var data: string = `> This was cloned from [${projectName}](${projectLink})\n`;
    if (existsSync(out + "README.md")) data = data + readFileSync(out + "README.md").toString();
    writeFileSync(out + "README.md", data);
    await git.add("README.md")
    await git.commit("Modify README.md", "README.md", {
        "--author": `"${process.env['README_NAME']||"GiteaForwarder"} <${process.env['README_EMAIL']||"donotreply@bb1.fun"}>"`
    });
}