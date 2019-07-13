import { Permissions, Channel } from 'discord.js';
import { UserData, ChannelData } from '../../discord';
import { Mixin } from '../../utils/decorators';
import { Restricted } from './restricted';

const PERMISSION = Permissions.FLAGS;

@Mixin([Restricted])
export abstract class BotModule implements Restricted {
    roles: string[];
    permissions: number;
    channels: string[];
    chtypes: string[];
    grantAccess: (user: UserData) => boolean;
}