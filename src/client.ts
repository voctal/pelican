import { REST } from "./rest/rest";

/**
 * The client options.
 */
export interface ClientOptions {
    /**
     * Either an application token or a user token (api key).
     */
    token: string;
    /**
     * The root panel URL.
     */
    url: string;
}

/**
 * The client class.
 */
export abstract class Client {
    /**
     * The token used in the `Authorization` header.
     */
    public readonly token: string;
    /**
     * The root panel URL.
     */
    public readonly url: string;
    public readonly rest: REST;

    public constructor(options: ClientOptions) {
        if (options.url.endsWith("/api")) {
            throw new Error("options.url must be the panel URL. It cannot ends with /api");
        }

        this.token = options.token;
        this.url = options.url;
        this.rest = new REST(this);
    }
}
