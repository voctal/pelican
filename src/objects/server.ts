import z from "zod";
import { GenericObject, genericObjectSchema } from "./generic";
import { createListSchema } from "./list";

/**
 * The string value of the `object` property inside a server.
 */
export const serverObjectType = "server" as const;

/**
 * Represents a Pelican server.
 */
export interface Server extends GenericObject {
    object: typeof serverObjectType;
    attributes: ServerAttributes;
}

/**
 * Attributes of a server object.
 */
export interface ServerAttributes {
    id: number;
    external_id: string | null;
    uuid: string;
    identifier: string;
    name: string;
    /**
     * Can be an empty string.
     */
    description: string;
    /**
     * If installing or transferring, it should be a string.
     * Otherwise, null.
     */
    status: string | null;
    suspended: boolean;
    limits: ServerLimits;
    feature_limits: ServerFeatureLimits;
    /**
     * The owner id.
     */
    user: number;
    node: number;
    allocation: number;
    egg: number;
    container: ServerContainer;
    updated_at: string;
    created_at: string;
}

/**
 * The limits of a server.
 */
export interface ServerLimits {
    /**
     * Memory in MB.
     */
    memory: number;
    swap: number;
    /**
     * Storage in MB.
     */
    disk: number;
    io: number;
    /**
     * Percentage.
     */
    cpu: number;
    /**
     * Can be empty.
     */
    threads: string | null;
    /**
     * OOM = Out Of Memory
     */
    oom_disabled: boolean;
    /**
     * Kill the server if it exceeds its max memory usage.
     *
     * OOM = Out Of Memory
     */
    oom_killer: boolean;
}

/**
 * The feature limits of a server.
 */
export interface ServerFeatureLimits {
    databases: number;
    allocations: number;
    backups: number;
}

/**
 * The container settings of a server.
 */
export interface ServerContainer {
    startup_command: string;
    /**
     * The Docker image.
     */
    image: string;
    /**
     * 0 = not installed
     *
     * 1 = installed
     */
    installed: number;
    environment: Record<string, string>;
}

export const serverSchema = genericObjectSchema.extend({
    object: z.literal(serverObjectType),
    attributes: z.object({
        id: z.int(),
        external_id: z.string().nullable(),
        uuid: z.string(),
        identifier: z.string(),
        name: z.string(),
        description: z.string(),
        status: z.string().nullable(),
        suspended: z.boolean(),
        limits: z.object({
            memory: z.int(),
            swap: z.int(),
            disk: z.int(),
            io: z.int(),
            cpu: z.int(),
            threads: z.string().nullable(),
            oom_disabled: z.boolean(),
            oom_killer: z.boolean(),
        }),
        feature_limits: z.object({
            databases: z.int(),
            allocations: z.int(),
            backups: z.int(),
        }),
        user: z.int(),
        node: z.int(),
        allocation: z.int(),
        egg: z.int(),
        container: z.object({
            startup_command: z.string(),
            image: z.string(),
            installed: z.int(),
            environment: z.record(z.string(), z.string()),
        }),
        updated_at: z.string(),
        created_at: z.string(),
    }),
}) satisfies z.ZodType<Server>;

export const serverListSchema = createListSchema(serverSchema);
