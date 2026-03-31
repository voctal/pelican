import z from "zod";
import { GenericObject, genericObjectSchema } from "./generic";

/**
 * The string value of the `object` property inside a signed URL.
 */
export const resourceStatsObjectType = "stats" as const;

/**
 * Represents a server resource usage statistics.
 */
export interface ResourceStats extends GenericObject {
    object: typeof resourceStatsObjectType;
    attributes: ResourceStatsAttributes;
}

/**
 * Attributes of a server resource stats object.
 */
export interface ResourceStatsAttributes {
    /**
     * Current state.
     */
    current_state: string;
    /**
     * If the server is suspended.
     */
    is_suspended: boolean;
    resources: ServerResources;
}

/**
 * Server resources inside a `stats` object.
 */
export interface ServerResources {
    /**
     * Current memory usage in bytes.
     */
    memory_bytes: number;
    /**
     * Current CPU usage in percentage.
     *
     * This is non-integer number.
     */
    cpu_absolute: number;
    /**
     * Current disk usage in bytes.
     */
    disk_bytes: number;
    /**
     * Total bytes received.
     */
    network_rx_bytes: number;
    /**
     * Total bytes transmitted.
     */
    network_tx_bytes: number;
    /**
     * Server uptime in milliseconds.
     */
    uptime: number;
}

/**
 * Possible server states. (Possibly incomplete)
 */
export type ServerState = "running" | "starting" | "stopping" | "offline" | (string & {});

export const resourceStatsSchema = genericObjectSchema.extend({
    object: z.literal(resourceStatsObjectType),
    attributes: z.object({
        current_state: z.string(),
        is_suspended: z.boolean(),
        resources: z.object({
            memory_bytes: z.int(),
            cpu_absolute: z.number(),
            disk_bytes: z.int(),
            network_rx_bytes: z.int(),
            network_tx_bytes: z.int(),
            uptime: z.int(),
        }),
    }),
}) satisfies z.ZodType<ResourceStats>;
