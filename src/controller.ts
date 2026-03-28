import { Client } from "./client";

/**
 * The base class for a controller.
 */
export abstract class Controller {
    public constructor(public readonly client: Client) {}
}
