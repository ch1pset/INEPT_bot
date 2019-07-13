import { Guild, GuildChannel, DMChannel, GroupDMChannel, TextChannel } from "discord.js";

type Channel = GuildChannel | DMChannel | GroupDMChannel | TextChannel;


export class ChannelData {
    public server: string
    public name: string;
    public id: string;
    public type: string;

    constructor(channel: Channel, guild: Guild) {
        this.server = guild? guild.name : null;
        this.name = channel['name'];
        this.id = channel.id;
        this.type = channel.type;
    }

    get isText() {
        return this.type === 'text';
    }
    get isDM() {
        return this.type === 'dm';
    }
    get isGroup() {
        return this.type === 'group';
    }
}