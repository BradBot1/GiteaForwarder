import { Forward } from '../Forward/Forward'
import { simpleGit as Git } from 'simple-git';
import { GitAuthor } from './GitAuthor';
import { Recipient } from '../Forward/Recipient';
import { execSync } from 'child_process';
import { writeFileSync } from 'fs'

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
    git.push("fumo");
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

export async function handleForward(forward: Forward):Promise<void> {
    const git = Git().env('GIT_SSH_COMMAND', 'ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no');
    await git.clone(forward.origin);
    git.log()
}