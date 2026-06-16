import { Client, ClientOptions } from "../client";
import { Mounts } from "./mounts";
import { Nodes } from "./nodes";
import { Servers } from "./servers";
import { Users } from "./users";

/**
 * The Application API wrapper class.
 */
export class PelicanApplication extends Client {
    /**
     * The nodes controller.
     */
    public readonly nodes: Nodes;
    /**
     * The servers controller.
     */
    public readonly servers: Servers;
    /**
     * The users controller.
     */
    public readonly users: Users;
    /**
     * The mounts controller.
     */
    public readonly mounts: Mounts;

    public constructor(options: ClientOptions) {
        super(options);
        this.nodes = new Nodes(this);
        this.servers = new Servers(this);
        this.users = new Users(this);
        this.mounts = new Mounts(this);
    }
}
