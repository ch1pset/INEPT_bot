import { Permissions } from 'discord.js';
import { str } from "../../utils/typedefs";
import { UserData, ChannelData } from "../../discord";

export class AccessRestrictions {
    roles: str[];
    permissions: number;
    channels: str[];
    chtypes: str[];
    constructor(roles: string[], permissions: number, channels?: string[], chtypes?: string[]) {
        this.roles = roles;
        this.permissions = permissions;
        this.channels = channels;
        this.chtypes = chtypes;
    }
    grant(user: UserData) {
        return this.roles.some(r => user.hasRole(r))
            || user.hasPermission(this.permissions);
    }
}