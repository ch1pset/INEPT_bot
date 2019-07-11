import { Permissions as Perms } from 'discord.js';
import { Dictionary, Status, str, bool, Callback, NodeCallback } from "../utils";
import { Logger } from './logger.service';
const PERMISSION = Perms.FLAGS;

export class DbManager<T> {
    private _db = new Dictionary<T>();
    private _fname: str;

    constructor(private logger: Logger) { }

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
        this.queue(
            () => this.updateDB(),
            (stat) => {
            if(stat !== Status.ERROR) this.logger.info(`Successfully added ${name} to database!`);
            else this.logger.warn(`DB is busy, attempting write in 2000ms`);
            });
    }

    public has(name: string): bool {
        return this._db.has(name);
    }

    public get(name: string): T {
        return this._db.get(name);
    }

    public delete(name: string) {
        this._db.delete(name);
        this.queue(
            () => this.updateDB(),
            (stat) => {
            if(stat !== Status.ERROR) this.logger.info(`Successfully deleted ${name} to database!`);
            else this.logger.warn(`DB is busy, attempting write in 2000ms`);
            });
    }

    private queue(task: Callback<any>, stat: Callback<any>) {
        if(!this._db.isBusy) {
            task();
            stat(this._db.status);
        } else {
            stat(this._db.status);
            setTimeout(() => {
                task();
                }, 2000);
        }
    }

    private updateDB() {
        this._db.busy();
        this._db.writeToFile(this._fname, err => {
            if(!err) {
                this._db.ready();
                this.logger.info('Write successful.');
            } else {
                this._db.error();
                this.logger.info('Write failed.');
            }
            })
    }
}