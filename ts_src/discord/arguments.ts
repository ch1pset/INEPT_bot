
export class UserArgs {
    cmd: string = "";
    text: string[] = [];
    code: string = "";
    url: string = "";
    list: string[] = [];

    private constructor() { }
    static parse(input: string): UserArgs {
        let regx = /!([a-zA-Z0-9]+)|"(.{1,300}?)"|```\w{0,9}([\w\W]{1,1500}?)```|(https?:\/\/[^ "<>\\^`{|}\s]{1,500})|([\w!-/@?]+)/g;
        let args = new UserArgs();
        let arr = [];
        while((arr = regx.exec(input)) !== null) {
            if(arr[1] && !args.cmd) 
                args.cmd = arr[1];
            if(arr[2])
                args.text.push(arr[2]);
            if(arr[3] && !args.code) 
                args.code = arr[3];
            if(arr[4] && !args.url) 
                args.url = arr[4];
            if(arr[5])
                args.list.push(arr[5]);
        }
        return args;
    }
}
