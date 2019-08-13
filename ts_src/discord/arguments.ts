
export interface Model {
    cmd: string;
    text?: string[];
    code?: string;
    url?: string;
    list?: string[];
    encoded?: string;
}

export function parse(input: string): Model {
    let regx = /!([a-zA-Z0-9]+)|"(.{1,300}?)"|```\w{0,9}([\w\W]{1,1500}?)```|(https?:\/\/[^ "<>\\^`{|}\s]{1,500})|([\w!-/@?]+)/g;
    let args = {cmd:"", text:[], code:"", url:"", list:[], encoded:""};
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
    args.encoded = encodeURI(args.list.join(' '));
    return args;
}
