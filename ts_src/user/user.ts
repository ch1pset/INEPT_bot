import { Message, Collection, Role, Permissions } from 'discord.js';

const PERMISSION = Permissions.FLAGS;

export class UserData {
    public name: string;
    public id: string;

    private roles: Collection<string, Role>;
    private permissions: number;

    constructor(msg: Message) {
        this.name = msg.author.username;
        this.id = msg.author.id;
        this.roles = msg.member? msg.member.roles : null;
        this.permissions = msg.member? msg.member.permissions.bitfield : 0x0;
    }
    get isAdmin(): boolean {
        return (this.permissions & PERMISSION.ADMINISTRATOR) === PERMISSION.ADMINISTRATOR;
    }
    get isMod(): boolean {
        let mod = PERMISSION.BAN_MEMBERS | PERMISSION.KICK_MEMBERS;
        return (this.permissions & mod) === mod;
    }
    hasRole(role: string): boolean {
        return this.roles ? this.roles.some(r => r.name === role) : false;
    }
    hasPermission(permissions: number): boolean {
        return (this.permissions & permissions) === permissions;
    }
}