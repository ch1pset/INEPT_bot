import { Permissions, Channel } from 'discord.js';
import { UserData, ChannelData } from '../../discord';
import { Subscriber, Subscribable } from '../../utils/subscriber';
import { Mixin } from '../../utils/decorators';
import { Restricted } from './restricted';

const PERMISSION = Permissions.FLAGS;

@Mixin([Restricted, Subscriber])
export abstract class BotModule implements Subscriber, Restricted {
    roles: string[];
    permissions: number;
    channels: string[];
    chtypes: string[];
    grantAccess: (user: UserData) => boolean;

    subscribe: (target: Subscribable, event: string) => Subscriber;
    unsubscribe: (target: Subscribable, event: string) => Subscriber;
}