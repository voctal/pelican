import { Controller } from "../controller";
import { ClientServer, clientServerListSchema, clientServerSchema } from "../objects/client-server";
import { List } from "../objects/list";
import { ResourceStats, resourceStatsSchema } from "../objects/stats";
import { WebSocketToken, webSocketTokenSchema } from "../objects/websocket-token";
import { PelicanError } from "../rest/errors";

/**
 * A server power action.
 */
export enum PowerAction {
    /**
     * Start the server.
     */
    Start = "start",
    /**
     * Gracefully stop the server.
     */
    Stop = "stop",
    /**
     * Restart the server.
     */
    Restart = "restart",
    /**
     * Force kill the server process.
     */
    Kill = "kill",
}

/**
 * The request options to send a command.
 */
export interface SendCommandOptions {
    /**
     * Length must be `>= 1`
     */
    command: string;
}

/**
 * The request options to send a power action.
 */
export interface SendPowerActionOptions {
    /**
     * The signal to send.
     */
    signal: PowerAction;
}

/**
 * The client servers controller.
 *
 * - Type: Client
 *
 * - Path: `/api/client/servers/{server}/network/allocations`
 */
export class ClientServers extends Controller {
    /**
     * Return all the servers available to the client making the API request,
     * including servers the user has access to as a subuser.
     *
     * Route: `GET /api/client`
     */
    public async list(): Promise<List<ClientServer>> {
        // include "allocations" "variables"
        // page: number
        // per_page: number (max 100)
        // type: string

        const json = await this.client.rest.get("client");
        return clientServerListSchema.parse(json);
    }

    /**
     * Get the details of a server.
     *
     * Route: `GET /api/client/servers/{server}`
     *
     * @param serverId - Server short ID
     */
    public async get(serverId: string): Promise<ClientServer> {
        const json = await this.client.rest.get(`client/servers/${serverId}`);
        return clientServerSchema.parse(json);
    }

    /**
     * Get real-time resource usage statistics for a server.
     *
     * Note from the official docs: "This value is cached for up to 20 seconds".
     *
     * Route: `GET /api/client/servers/{server}/resources`
     *
     * @param serverId - Server short ID
     */
    public async getResourceUsage(serverId: string): Promise<ResourceStats> {
        const json = await this.client.rest.get(`client/servers/${serverId}/resources`);
        return resourceStatsSchema.parse(json);
    }

    /**
     * Get a WebSocket token to create a new session.
     * Tokens expires 10 minutes after creation.
     *
     * Route: `GET /api/client/servers/{server}/websocket`
     *
     * @param serverId - Server short ID
     */
    public async getWebSocketToken(serverId: string): Promise<WebSocketToken> {
        const json = await this.client.rest.get(`client/servers/${serverId}/websocket`);
        return webSocketTokenSchema.parse(json);
    }

    /**
     * Send a command to a running server.
     *
     * Route: `POST /api/client/servers/{server}/command`
     *
     * @param serverId - Server short ID
     */
    public async sendCommand(serverId: string, options: SendCommandOptions) {
        const response = await this.client.rest.rawPost(`client/servers/${serverId}/command`, options);

        if (response.status !== 204) {
            throw new PelicanError({
                message: "Failed to send command, the API did not return a 204",
                response: response,
            });
        }
    }

    /**
     * Send a power action to a server.
     *
     * Route: `POST /api/client/servers/{server}/power`
     *
     * @param serverId - Server short ID
     */
    public async sendPowerAction(serverId: string, options: SendPowerActionOptions) {
        const response = await this.client.rest.rawPost(`client/servers/${serverId}/power`, options);

        if (response.status !== 204) {
            throw new PelicanError({
                message: "Failed to send power action, the API did not return a 204",
                response: response,
            });
        }
    }
}
