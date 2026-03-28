import z from "zod";
import { GenericObject, genericObjectSchema } from "./generic";
import { createListSchema } from "./list";

/**
 * The string value of the `object` property inside a node object.
 */
export const nodeObjectType = "node" as const;

/**
 * Represents a node object.
 */
export interface Node extends GenericObject {
    object: typeof nodeObjectType;
    attributes: NodeAttributes;
}

/**
 * Attributes of a node object.
 */
export interface NodeAttributes {
    id: number;
    uuid: string;
    public: boolean;
    name: string;
    description: string | null;
    fqdn: string;
    scheme: string;
    behind_proxy: boolean;
    maintenance_mode: boolean;
    memory: number;
    memory_overallocate: number;
    disk: number;
    disk_overallocate: number;
    cpu: number;
    cpu_overallocate: number;
    upload_size: number;
    daemon_listen: number;
    daemon_sftp: number;
    daemon_base: string;
    /**
     * Creation date of the node. ISO 8601.
     */
    created_at: string;
    /**
     * Last update date of the node. ISO 8601.
     */
    updated_at: string;
    tags: string[];
    daemon_connect: number;
    allocated_resources: NodeAllocatedResources;
}

/**
 * The allocated resources of a node.
 */
export interface NodeAllocatedResources {
    memory: number;
    disk: number;
    cpu: number;
}

export const nodeSchema = genericObjectSchema.extend({
    object: z.literal(nodeObjectType),
    attributes: z.object({
        id: z.int(),
        uuid: z.string(),
        public: z.boolean(),
        name: z.string(),
        description: z.string().nullable(),
        fqdn: z.string(),
        scheme: z.string(),
        behind_proxy: z.boolean(),
        maintenance_mode: z.boolean(),
        memory: z.int(),
        memory_overallocate: z.int(),
        disk: z.int(),
        disk_overallocate: z.int(),
        cpu: z.int(),
        cpu_overallocate: z.int(),
        upload_size: z.int(),
        daemon_listen: z.int(),
        daemon_sftp: z.int(),
        daemon_base: z.string(),
        created_at: z.string(),
        updated_at: z.string(),
        tags: z.array(z.string()),
        daemon_connect: z.int(),
        allocated_resources: z.object({
            memory: z.int(),
            disk: z.int(),
            cpu: z.int(),
        }),
    }),
}) satisfies z.ZodType<Node>;

export const nodeListSchema = createListSchema(nodeSchema);
