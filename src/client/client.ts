import { Client, ClientOptions } from "../client";
import { Account } from "./account";
import { Allocations } from "./allocations";
import { APIKeys } from "./api-keys";
import { ClientServers } from "./client-servers";
import { Files } from "./files";

/**
 * The Client API wrapper class.
 */
export class PelicanClient extends Client {
    /**
     * The account controller.
     */
    public readonly account: Account;
    /**
     * The allocations controller.
     */
    public readonly allocations: Allocations;
    /**
     * The api keys controller.
     */
    public readonly apiKeys: APIKeys;
    /**
     * The files controller.
     */
    public readonly files: Files;
    /**
     * The servers controller.
     */
    public readonly servers: ClientServers;

    public constructor(options: ClientOptions) {
        super(options);
        this.account = new Account(this);
        this.allocations = new Allocations(this);
        this.apiKeys = new APIKeys(this);
        this.files = new Files(this);
        this.servers = new ClientServers(this);
    }
}
