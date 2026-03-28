import z from "zod";
import { Allocation, allocationListSchema } from "./allocation";
import { EggVariable, eggVariableListSchema } from "./egg-variable";
import { GenericObject, genericObjectSchema } from "./generic";
import { createListSchema, List } from "./list";
import { serverObjectType } from "./server";

/**
 * Represents a client server.
 */
export interface ClientServer extends GenericObject {
    object: typeof serverObjectType;
    attributes: ClientServerAttributes;
    meta: {
        is_server_owner: boolean;
        user_permissions: string[];
    };
}

/**
 * Attributes of a client server object.
 */
export interface ClientServerAttributes {
    server_owner: boolean;
    identifier: string;
    internal_id: number;
    uuid: string;
    name: string;
    node: string;
    is_node_under_maintenance: boolean;
    sftp_details: ClientServerSFTPDetails;
    /**
     * Can be empty.
     */
    description: string;
    limits: ClientServerLimits;
    invocation: string;
    docker_image: string;
    egg_features: unknown[];
    feature_limits: ClientServerFeatureLimits;
    status: unknown | null;
    is_suspended: boolean;
    is_installing: boolean;
    is_transferring: boolean;
    relationships?: {
        allocations?: List<Allocation>;
        variables?: List<EggVariable>;
    };
}

/**
 * The limits of a client server.
 */
export interface ClientServerLimits {
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
 * The feature limits of a client server.
 */
export interface ClientServerFeatureLimits {
    databases: number;
    allocations: number;
    backups: number;
}

/**
 * The SFTP details of a client server.
 */
export interface ClientServerSFTPDetails {
    ip: string;
    alias: string | null;
    port: number;
}

export const clientServerSchema = genericObjectSchema.extend({
    object: z.literal(serverObjectType),
    attributes: z.object({
        server_owner: z.boolean(),
        identifier: z.string(),
        internal_id: z.int(),
        uuid: z.string(),
        name: z.string(),
        node: z.string(),
        is_node_under_maintenance: z.boolean(),
        sftp_details: z.object({
            ip: z.string(),
            alias: z.string().nullable(),
            port: z.int(),
        }),
        description: z.string(),
        limits: z.object({
            memory: z.int(),
            swap: z.int(),
            disk: z.int(),
            io: z.int(),
            cpu: z.number(),
            threads: z.string().nullable(),
            oom_disabled: z.boolean(),
            oom_killer: z.boolean(),
        }),
        invocation: z.string(),
        docker_image: z.string(),
        egg_features: z.array(z.unknown()),
        feature_limits: z.object({
            databases: z.int(),
            allocations: z.int(),
            backups: z.int(),
        }),
        status: z.unknown().nullable(),
        is_suspended: z.boolean(),
        is_installing: z.boolean(),
        is_transferring: z.boolean(),
        relationships: z
            .object({
                allocations: allocationListSchema.optional(),
                variables: eggVariableListSchema.optional(),
            })
            .optional(),
    }),
    meta: z.object({
        is_server_owner: z.boolean(),
        user_permissions: z.array(z.string()),
    }),
}) satisfies z.ZodType<ClientServer>;

export const clientServerListSchema = createListSchema(clientServerSchema);
