import { Permissions as Perms } from 'discord.js';
import { Logger, Tasker } from '.';
import { Dictionary } from '../utils/structures';
import { str, bool } from '../utils/typedefs';
import { Status, Task } from '../utils/events';
const PERMISSION = Perms.FLAGS;

export class DbManager<T> {
    private _db = new Dictionary<T>();
    private _fname: str;

    constructor(fname: str,
        private tasker: Tasker,
        private logger: Logger
    ) {
        this.load(fname);
    }

    public load(fname: str) {
        if(this._db.status !== Status.NULL) {
            this._fname = fname;
            this._db.loadFromFile(this._fname, (err, dict) => {
                if(!err) this._db = dict;
                else this.logger.eror(err);
            });
        } else {
            const e = new Error(`Reloading database is not allowed. Reconsider your implementation.`);
            this.logger.eror(e);
        }
    }

    public add(name: string, link: T) {
        this._db.set(name, link);
        this.queueUpdate();
    }

    public has(name: string): bool {
        return this._db.has(name);
    }

    public get(name: string): T {
        return this._db.get(name);
    }

    public delete(name: string) {
        this._db.delete(name);
        this.queueUpdate();
    }

    private queueUpdate() {
        const update = new Task(task => {
            this.updateDB()
                .once('ready', () => {
                    task.done();
                })
                .once('error', () => {
                    task.error(new Error(`Database update failed.`));
                });
            });
        this.tasker.queue(update);
    }

    private updateDB() {
        this._db.busy();
        this._db.writeToFile(this._fname, err => {
            if(!err) {
                this._db.ready();
                this.logger.info('Write successful.');
            } else {
                this._db.error(err);
                this.logger.warn('Write failed.');
            }
            });
        return this._db;
    }
}