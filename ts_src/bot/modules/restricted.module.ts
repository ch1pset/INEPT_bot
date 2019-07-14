import { Permissions } from 'discord.js';
import { str } from "../../utils";
import { UserData, ChannelData } from "../../discord";
const PERMISSION = Permissions.FLAGS;

export class Restricted {
    roles: str[];
    permissions: number;
    channels: str[];
    chtypes: str[];
    grantAccess(user: UserData) {
        return this.roles.some(r => user.hasRole(r))
            || user.hasPermission(this.permissions);
    }
}