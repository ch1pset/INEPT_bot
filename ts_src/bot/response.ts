
export enum Response {
    REPLY,
    DM,
    GROUP_DM,
    CHANNEL
}

export interface IBotResponse {
    TYPE: Response;
    MSG: string;
}
