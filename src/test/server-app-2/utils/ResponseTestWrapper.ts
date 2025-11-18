import { HTTP_CODES, HTTP_METHODS } from "../../../app/server_app/model/ServerModel";

export class ResponseTestWrapper {
    public statusCode: HTTP_CODES;
    public headers = new Array<object>()
    public body: object;

    public writeHead(statusCode: HTTP_CODES, header: object) {
        this.statusCode = statusCode;
        this.headers.push(header);


    }

    public write(stringifiedBody: string) {
        this.body = JSON.parse(stringifiedBody);
    }

    public end() {}

        public clearFields() {
        this.headers.length = 0;
        this.body = undefined;
        this.statusCode = undefined

    }
    
}