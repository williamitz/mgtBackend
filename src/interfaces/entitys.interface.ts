export interface PayloadSingIn {
    id: number;
    userName: string;
    nameComplete: string;
}


export interface ResponsePromise {
    ok: boolean;
    message: string;
    error?: any;
}
