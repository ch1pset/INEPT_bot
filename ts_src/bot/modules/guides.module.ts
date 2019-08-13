import { sheets } from '../../../config.json';
import * as Service from "../../services";
import { UserArgs } from "../../discord";
import { Message } from "discord.js";
import { TryCatch } from '../../utils/decorators/index.js';



export function Guides(
    sheetsService: Service.Sheet<string[]>,
    msgService: Service.Responder,
    logger: Service.Logger) {

        sheetsService.loadSheet(sheets.guides, 'A:F');

        const category = (cat: string) => {
            return sheetsService.search(([...info]) => {
                return info[5].includes(cat) || info[5] === 'All';
            }).map(([name, url, op, date, ...info]) => {
                return `${name}: <${url}>\nPosted by ${op} on ${date}`;
            }).join('\n');
        }

        this.refresh = function(args: UserArgs.Model, msg: Message) {
            sheetsService.loadSheet(sheets.guides, 'A:F')
            .once('ready', () => {
                msgService.send(msg, 'Guides sheet refreshed!');
            })
        }

        this.link = function(args: UserArgs.Model, msg: Message) {
            msgService.reply(msg, 'https://docs.google.com/spreadsheets/d/' + sheets.guides);
        }
        
        this.get = function(args: UserArgs.Model, msg: Message) {
            if(args.list[0]) {
                const guide = sheetsService.fetch(([name, ...info]) => {
                        return name.toLowerCase() === args.list.join(' ');
                    });
                if(guide) {
                    msgService.send(msg, `${guide[0]}: ${guide[1]}\nPosted by ${guide[2]} on ${guide[3]}`);
                } else {
                    msgService.reply(msg, `I couldn't find that one.`);
                }
            } else {
                msgService.reply(msg, `Please specify the name of the guide.`);
            }
        }
    }