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