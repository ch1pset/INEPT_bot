
import { EventEmitter } from 'events';
import { Permissions } from 'discord.js';
import { UserData } from '../../user/user';
import { Subscriber, Subscribable } from '../../utils/subscriber';
import { Mixin } from '../../utils/decorators';

const PERMISSION = Permissions.FLAGS;

@Mixin([Subscriber])
export class BotModule implements Subscriber
{
    public subscribe: (target: Subscribable, event: string) => Subscriber;
    public unsubscribe: (target: Subscribable, event: string) => Subscriber;

    protected ROLES: string[];
    protected PERMISSIONS: number;

    constructor(roles?: string[], permissions?: number)
    {
        this.ROLES = roles;
        this.PERMISSIONS = permissions;
    }

    protected checkPermissions(user: UserData): boolean
    {
        return this.ROLES.some(r => user.hasRole(r)) || user.hasPermission(this.PERMISSIONS);
    }
}