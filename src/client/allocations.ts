import { Controller } from "../controller";
import { Allocation, allocationListSchema } from "../objects/allocation";
import { List } from "../objects/list";

/**
 * The allocations controller.
 *
 * - Type: Client
 *
 * - Path: `/api/client/servers/{server}/network/allocations`
 */
export class Allocations extends Controller {
    /**
     * Lists all the allocations available to a server and whether
     * they are currently assigned as the primary for this server.
     *
     * Route: `GET /api/client/servers/{server}/network/allocations`
     *
     * @param serverId - Server short ID
     */
    public async list(serverId: string): Promise<List<Allocation>> {
        const json = await this.client.rest.get(`client/servers/${serverId}/network/allocations`);
        return allocationListSchema.parse(json);
    }
}
