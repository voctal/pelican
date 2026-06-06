import { z } from "zod";
import { Controller } from "../controller";
import { query } from "../rest/query";
import {
    WingServer,
    WingServerInstallLogs,
    wingServerInstallLogsSchema,
    WingServerLogs,
    wingServerLogsSchema,
    wingServerSchema,
} from "./servers-objects";

/**
 * The request options to list nodes.
 */
export interface WingGetServerLogsOptions {
    /**
     * Number of lines to returns. 100 by default.
     */
    size?: number;
}

/**
 * The wing servers controller.
 *
 * - Type: Wings
 *
 * - Path: `<wing>/api/servers`
 */
export class WingServers extends Controller {
    /**
     * Returns the wing servers.
     *
     * Route: `GET <wing>/api/servers`
     */
    public async list(): Promise<WingServer[]> {
        const json = await this.client.rest.get("servers");
        return z.array(wingServerSchema).parse(json);
    }

    /**
     * Returns the server data.
     *
     * Route: `GET <wing>/api/servers/{uuid}`
     */
    public async get(uuid: string): Promise<WingServer> {
        const json = await this.client.rest.get(`servers/${uuid}`);
        return wingServerSchema.parse(json);
    }

    /**
     * Returns the logs of a running server.
     * Returns the last 100 lines by default.
     *
     * Route: `GET <wing>/api/servers/{uuid}/logs`
     */
    public async getLogs(uuid: string, options: WingGetServerLogsOptions): Promise<WingServerLogs> {
        const params = query(options);
        const json = await this.client.rest.get(`servers/${uuid}/logs${params}`);

        return wingServerLogsSchema.parse(json);
    }

    /**
     * Returns the last install logs of a server.
     *
     * Route: `GET <wing>/api/servers/{uuid}/install-logs`
     */
    public async getInstallLogs(uuid: string): Promise<WingServerInstallLogs> {
        const json = await this.client.rest.get(`servers/${uuid}/install-logs`);
        return wingServerInstallLogsSchema.parse(json);
    }
}
