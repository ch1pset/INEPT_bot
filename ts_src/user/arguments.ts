
export interface UserArgs {
    cmd: string;
    text?: string[];
    code?: string;
    url?: string;
    list?: string[];
}

export function parseArgs(input: string): UserArgs {
    let regx = /^!([a-zA-Z0-9]+)|"(.{1,300}?)"|```\w{0,9}([\w\W]{1,1500}?)```|(https?:\/\/[^ "<>\\^`{|}\s]{1,500})|([\w!-/@?]+)/g;
    let args: UserArgs = {cmd:""};
    let arr = [];
    while((arr = regx.exec(input)) !== null) {

        if(arr[1] && !args.cmd) 
            args.cmd = arr[1];

        if(arr[2]) args.text ? 
            args.text.push(arr[2]) 
            : args.text = [ arr[2] ];

        if(arr[3] && !args.code) 
            args.code = arr[3];

        if(arr[4] && !args.url) 
            args.url = arr[4];

        if(arr[5]) args.list? 
            args.list.push(arr[6]) 
            : args.list = [ arr[6] ];

    }
    return args;
}