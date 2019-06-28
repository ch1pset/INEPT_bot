
import { EventEmitter } from 'events';
import { Permissions } from 'discord.js';
import { UserData } from '../../user/user';
import { Subscriber } from '../../utils/subscriber';

const PERMISSION = Permissions.FLAGS;


export abstract class BotModule extends Subscriber
{
    private ROLES: string[];
    private PERMISSIONS: number;

    constructor(roles?: string[], permissions?: number)
    {
        super();
        this.ROLES = roles;
        this.PERMISSIONS = permissions;
    }
    public checkPermissions(user: UserData): boolean
    {
        return this.ROLES.some(r => user.hasRole(r)) || user.hasPermission(this.PERMISSIONS);
    }

    public subscribe(emitter: EventEmitter, event: string): EventEmitter {
        return emitter.on(event, this[event]);
    }

    public unsubscribe(emitter: EventEmitter, event: string): EventEmitter {
        return emitter.off(event, this[event]);
    }
}