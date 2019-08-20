import { User, GuildMember, Collection, Role, Permissions } from 'discord.js';

const PERMISSION = Permissions.FLAGS;

export class UserData {
    public name: string;
    public id: string;

    private roles: Collection<string, Role>;
    private permissions: number;

    constructor(user: User, member: GuildMember) {
        this.name = user.username;
        this.id = user.id;
        this.roles = member? member.roles : null;
        this.permissions = member? member.permissions.bitfield : 0x0;
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