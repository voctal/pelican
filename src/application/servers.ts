import { Controller } from "../controller";
import { List } from "../objects/list";
import { Server, serverListSchema, serverSchema } from "../objects/server";
import { PelicanError } from "../rest/errors";
import { query } from "../rest/query";
import { Filters, Includes, Sorter } from "../utils";

/**
 * The request options to list servers.
 */
export interface ServerListOptions {
    /**
     * Page number for pagination.
     */
    page?: number;
    /**
     * Results per page (1-100)
     */
    per_page?: number;
    /**
     * Filter by fields.
     */
    filters?: Filters<{
        name: string;
        uuid: string;
        external_id: string;
        image: string;
    }>;
    /**
     * Sort by fields.
     */
    sort?: Sorter<"id" | "uuid" | "name" | "created_at" | "updated_at">;
    /**
     * Include relationships.
     */
    include?: Includes<string>;
}

/**
 * The request options to create a server.
 */
export interface ServerCreateOptions {
    /**
     * Length: `>= 1 && <= 255`
     */
    external_id?: string | null;
    /**
     * Length: `>= 1 && <= 255`
     */
    name: string;
    description?: string | null;
    user: number;
    egg: number;
    docker_image?: string;
    startup?: string;
    environment: Record<string, string>;
    skip_scripts?: boolean;
    oom_killer?: boolean;
    start_on_completion?: boolean;
    limits: {
        memory: number;
        /**
         * `>= -1`
         */
        swap: number;
        disk: number;
        /**
         * `>= 0 && <= 1000`
         */
        io: number;
        /**
         * `^[0-9-,]+$`
         */
        threads?: string | null;
        cpu: number;
    };
    feature_limits: {
        /**
         * `>= 0`
         */
        databases: number | null;
        /**
         * `>= 0`
         */
        allocations?: number | null;
        /**
         * `>= 0`
         */
        backups: number | null;
    };
    allocation?: {
        default?: string;
        additional?: string[];
    };
    deploy?: {
        tags?: string[];
        dedicated_ip?: boolean;
        port_range?: string[];
    };
}

/**
 * The request options to update a server details.
 */
export interface ServerUpdateDetailsOptions {
    /**
     * Length: `>= 1 && <= 255`
     */
    external_id?: string | null;
    /**
     * Length: `>= 1 && <= 255`
     */
    name: string;
    user: number;
    description?: string | null;
}

/**
 * The request options to update a server build.
 */
export interface ServerUpdateBuildOptions {
    allocation?: number | null;
    oom_killer?: boolean;
    limits?: {
        memory?: number;
        swap?: number;
        io?: number;
        cpu?: number;
        threads?: string | null;
        disk?: number;
    };
    add_allocations?: number[];
    remove_allocations?: number[];
    feature_limits: {
        databases: number | null;
        allocations?: number | null;
        backups: number | null;
    };
}

/**
 * The request options to update a server startup.
 */
export interface ServerUpdateStartupOptions {
    startup?: string;
    environment: Record<string, string>;
    egg: number;
    image?: string;
    skip_scripts: boolean;
}

/**
 * The servers controller.
 *
 * - Type: Application
 *
 * - Path: `/api/application/servers`
 */
export class Servers extends Controller {
    /**
     * Return all the servers that currently exist on the panel.
     *
     * Route: `GET /api/application/servers`
     */
    public async list(options?: ServerListOptions): Promise<List<Server>> {
        const params = query(options);
        const json = await this.client.rest.get(`application/servers${params}`);

        return serverListSchema.parse(json);
    }

    /**
     * Show a single server.
     *
     * Route: `GET /api/application/servers/{server}`
     */
    public async get(id: number): Promise<Server> {
        const json = await this.client.rest.get(`application/servers/${id}`);
        return serverSchema.parse(json);
    }

    /**
     * Retrieve a specific server from the database using its external ID.
     *
     * Route: `GET /api/application/servers/external/{external_id}`
     */
    public async getByExternalId(externalId: number): Promise<Server> {
        const json = await this.client.rest.get(`application/servers/external/${externalId}`);
        return serverSchema.parse(json);
    }

    /**
     * Create a new server on the system.
     *
     * Route: `POST /api/application/servers`
     */
    public async create(options: ServerCreateOptions): Promise<Server> {
        const json = await this.client.rest.post("application/servers", options);
        return serverSchema.parse(json);
    }

    /**
     * Suspend a server on the panel.
     *
     * Route: `POST /api/application/servers/{server}/suspend`
     */
    public async suspend(id: number) {
        const response = await this.client.rest.rawPost(`application/servers/${id}/suspend`);

        if (response.status !== 204) {
            throw new PelicanError({
                message: "Failed to suspend server, the API did not return a 204",
                response: response,
            });
        }
    }

    /**
     * Unsuspend a server on the panel.
     *
     * Route: `POST /api/application/servers/{server}/unsuspend`
     */
    public async unsuspend(id: number) {
        const response = await this.client.rest.rawPost(`application/servers/${id}/unsuspend`);

        if (response.status !== 204) {
            throw new PelicanError({
                message: "Failed to unsuspend server, the API did not return a 204",
                response: response,
            });
        }
    }

    /**
     * Update the details for a specific server.
     *
     * Route: `PATCH /api/application/servers/{server}/details`
     */
    public async updateDetails(id: number, options: ServerUpdateDetailsOptions) {
        await this.client.rest.rawPatch(`application/servers/${id}/details`, options);
    }

    /**
     * Update the build details for a specific server.
     *
     * Route: `PATCH /api/application/servers/{server}/build`
     */
    public async updateBuild(id: number, options: ServerUpdateBuildOptions) {
        await this.client.rest.patch(`application/servers/${id}/build`, options);
    }

    /**
     * Update the startup and environment settings for a specific server.
     *
     * Route: `PATCH /api/application/servers/{server}/startup`
     */
    public async updateStartup(id: number, options: ServerUpdateStartupOptions) {
        await this.client.rest.rawPatch(`application/servers/${id}/startup`, options);
    }

    /**
     * Deletes a server.
     *
     * Route: `DELETE /api/application/servers/{server}`
     */
    public async delete(id: number) {
        const response = await this.client.rest.rawDelete(`application/servers/${id}`);

        if (response.status !== 204) {
            throw new PelicanError({
                message: "Failed to delete server, the API did not return a 204",
                response: response,
            });
        }
    }

    /**
     * Force deletes a server, even if server is running.
     *
     * Route: `DELETE /api/application/servers/{server}/{force}`
     */
    public async deleteForce(id: number) {
        const response = await this.client.rest.rawDelete(`application/servers/${id}/true`);

        if (response.status !== 204) {
            throw new PelicanError({
                message: "Failed to force delete server, the API did not return a 204",
                response: response,
            });
        }
    }
}
