import { HTTP_METHODS } from "../../../app/server_app/model/ServerModel";

export class RequestTestWrapper {
    public headers = new Array<object>;
    public url: string;
    public method: HTTP_METHODS;
    public body: object

    public on(event: string, cb: Function) {
        if (event === "data") {
            cb(JSON.stringify(this.body));
        } else {
            cb()
        }
    }

    public clearFields() {
        this.headers = new Array<object>;;
        this.body = undefined;
        this.url = undefined;
        this.method = undefined;
    }
}