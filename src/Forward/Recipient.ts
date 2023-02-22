import { GitAuthor } from '../Git/GitAuthor';

export class Recipient {

    public readonly humanName: string;
    public readonly url:string;
    public authorMap: Map<string, GitAuthor> = new Map<string, GitAuthor>();

    constructor(url: string, humanName: string|undefined) {
        this.url = url;
        this.humanName = humanName||url;
    }

    public setAuthor(gitAuthor: string, newName: string, newEmail: string):void {
        this.authorMap.set(gitAuthor, new GitAuthor(newName, newEmail));
    }

    public formatAuthor(gitAuthor: string): string {
        const author: GitAuthor|undefined = this.authorMap.get(gitAuthor);
        if (author === undefined) return gitAuthor;
        return author.format();
    }

}