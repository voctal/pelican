import { Client, ClientOptions } from "../client";
import { WingServers } from "./servers";
import { WingSystem } from "./system";

/**
 * The Wings API wrapper class.
 */
export class PelicanWing extends Client {
    /**
     * The system controller.
     */
    public readonly system: WingSystem;
    /**
     * The servers controller.
     */
    public readonly servers: WingServers;

    public constructor(options: ClientOptions) {
        super(options);
        this.system = new WingSystem(this);
        this.servers = new WingServers(this);
    }
}
