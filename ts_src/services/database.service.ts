import { Permissions as Perms } from 'discord.js';
import { Dictionary, Stat } from "../utils";
const PERMISSION = Perms.FLAGS;

export class DbManager {

    private _dbList: Dictionary<any>[];

    constructor() { }

    public load() {

    }

    // public load() {
    //     if(this._db.status !== Stat.NULL) {
    //         this._db.readFromFile(this.fname, (err, dict) => {
    //             if(!err) this._db = dict;
    //             else throw err;
    //         });
    //     } else {
    //         throw Error(`Reloading database is not allowed. Reconsider your implementation.`);
    //     }
    // }

    // public add(name: string, link: T) {
    //     this._db.set(name, link);
    //     this.updateDB();
    // }

    // public get(name: string): T {
    //     return this._db.get(name);
    // }

    // public delete(name: string) {
    //     this._db.delete(name);
    //     this.updateDB();
    // }

    // private updateDB() {
    //     if(!this._db.isBusy) {
    //         this._db.writeToFile(this.fname, err => {
    //             if(!err) console.log('Write successful.');
    //             else console.log('Write failed.');
    //             })
    //     } else {
    //         console.log('DB is busy, attempting update in 2000ms');
    //         setTimeout(() => {
    //             this.updateDB();
    //             }, 2000);
    //     }
    // }
}