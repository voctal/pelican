import { Controller } from "../controller";
import { Egg, eggGenericListSchema } from "../objects/egg";
import { GenericList, List } from "../objects/list";
import { Mount, mountListSchema, mountSchema } from "../objects/mount";
import { Node, nodeGenericListSchema } from "../objects/node";
import { Server, serverGenericListSchema } from "../objects/server";
import { PelicanError } from "../rest/errors";
import { query } from "../rest/query";
import { Filters, Sorter } from "../utils";

/**
 * The request options to list mounts.
 */
export interface MountListOptions {
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
        uuid: string;
        name: string;
    }>;
    /**
     * Sort by fields.
     */
    sort?: Sorter<"id" | "uuid">;
}

/**
 * The request options to assign servers to a mount.
 */
export interface AssignMountServersOptions {
    /**
     * The server IDs to add.
     */
    servers: number[];
}

/**
 * The mounts controller.
 *
 * - Type: Application
 *
 * - Path: `/api/application/mounts`
 */
export class Mounts extends Controller {
    /**
     * Return all the mounts currently available on the panel.
     *
     * Route: `GET /api/application/mounts`
     */
    public async list(options?: MountListOptions): Promise<List<Mount>> {
        const params = query(options);
        const json = await this.client.rest.get(`application/mounts${params}`);

        return mountListSchema.parse(json);
    }

    /**
     * Return data for a single instance of a mount.
     *
     * Route: `GET /api/application/mounts/{mount}`
     */
    public async get(id: number): Promise<Mount> {
        const json = await this.client.rest.get(`application/mounts/${id}`);
        return mountSchema.parse(json);
    }

    /**
     * List the assigned eggs of the mount.
     *
     * Route: `GET /api/application/mounts/{mount}/eggs`
     */
    public async getAssignedEggs(id: number): Promise<GenericList<Egg>> {
        const json = await this.client.rest.get(`application/mounts/${id}/eggs`);
        return eggGenericListSchema.parse(json);
    }

    /**
     * List the assigned nodes of the mount.
     *
     * Route: `GET /api/application/mounts/{mount}/nodes`
     */
    public async getAssignedNodes(id: number): Promise<GenericList<Node>> {
        const json = await this.client.rest.get(`application/mounts/${id}/nodes`);
        return nodeGenericListSchema.parse(json);
    }

    /**
     * List the assigned servers of the mount.
     *
     * Route: `GET /api/application/mounts/{mount}/servers`
     */
    public async getAssignedServers(id: number): Promise<GenericList<Server>> {
        const json = await this.client.rest.get(`application/mounts/${id}/servers`);
        return serverGenericListSchema.parse(json);
    }

    /**
     * Adds servers to the mount's many-to-many relation.
     *
     * Route: `POST /api/application/mounts/{mount}/servers`
     */
    public async assignServers(id: number, options: AssignMountServersOptions): Promise<void> {
        await this.client.rest.post(`application/mounts/${id}/servers`, options);
    }

    /**
     * Deletes a server from the mount's many-to-many relation.
     *
     * Route: `DELETE /api/application/mounts/{mount}/servers/{server_id}`
     */
    public async unassignServer(id: number, serverId: number): Promise<void> {
        const response = await this.client.rest.rawDelete(`application/mounts/${id}/servers/${serverId}`);

        if (response.status !== 204) {
            throw new PelicanError({
                message: "Failed to unassign server from the mount, the API did not return a 204",
                response: response,
            });
        }
    }
}
