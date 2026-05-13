import { REST } from "./rest/rest";

/**
 * The client options.
 */
export interface ClientOptions {
    /**
     * One of:
     *
     * - Application API Key
     *
     * - Client API Key
     *
     * - Wing Token
     */
    token: string;
    /**
     * The root panel URL, or a wing URL.
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
            throw new Error("options.url must be the base URL. It cannot ends with /api");
        }

        this.token = options.token;
        this.url = options.url;
        this.rest = new REST(this);
    }
}
