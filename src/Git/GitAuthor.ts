export class GitAuthor {
    
    public readonly name: string;
    public readonly email: string;

    constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
    }

    public format(): string {
        return `${this.name} <${this.email}>`;
    }

}