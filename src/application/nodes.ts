import { Controller } from "../controller";
import { List } from "../objects/list";
import { Node, nodeListSchema, nodeSchema } from "../objects/node";
import { query } from "../rest/query";
import { Filters, Includes, Sorter } from "../utils";

/**
 * The request options to list nodes.
 */
export interface NodeListOptions {
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
        fqdn: string;
    }>;
    /**
     * Sort by fields.
     */
    sort?: Sorter<"id" | "uuid" | "name" | "created_at" | "updated_at">;
    /**
     * Include relationships.
     */
    include?: Includes<"allocations" | "location" | "servers">;
}

/**
 * The nodes controller.
 *
 * - Type: Application
 *
 * - Path: `/api/application/nodes`
 */
export class Nodes extends Controller {
    /**
     * Return all the nodes currently available on the panel.
     *
     * Route: `GET /api/application/nodes`
     */
    public async list(options?: NodeListOptions): Promise<List<Node>> {
        const params = query(options);
        const json = await this.client.rest.get(`application/nodes${params}`);

        return nodeListSchema.parse(json);
    }

    /**
     * Return data for a single instance of a node.
     *
     * Route: `GET /api/application/nodes/{node}`
     */
    public async get(id: number): Promise<Node> {
        const json = await this.client.rest.get(`application/nodes/${id}`);
        return nodeSchema.parse(json);
    }
}
