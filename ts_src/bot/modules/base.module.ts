
import { EventEmitter } from 'events';
import { Permissions } from 'discord.js';
import { UserData } from '../../user/user';
import { Subscriber } from '../../utils/subscriber';

const PERMISSION = Permissions.FLAGS;


export class BotModule extends Subscriber
{
    protected ROLES: string[];
    protected PERMISSIONS: number;

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
}