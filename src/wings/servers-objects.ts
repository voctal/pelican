import { z } from "zod";
import { ServerState } from "../objects/stats";

/**
 * A server utilization data. If the server is offline,
 * everything other than `disk_bytes` is `0`.
 */
export interface WingServerUtilization {
    /**
     * In bytes.
     */
    memory_bytes: number;
    /**
     * In bytes.
     */
    memory_limit_bytes: number;
    cpu_absolute: number;
    network: { rx_bytes: number; tx_bytes: number };
    /**
     * Server uptime in milliseconds.
     */
    uptime: number;
    state: ServerState;
    disk_bytes: number;
}

export const wingServerUtilizationSchema = z.object({
    memory_bytes: z.int(),
    memory_limit_bytes: z.int(),
    cpu_absolute: z.number(),
    network: z.object({ rx_bytes: z.int(), tx_bytes: z.int() }),
    uptime: z.int(),
    state: z.string().min(1),
    disk_bytes: z.int(),
}) satisfies z.ZodType<WingServerUtilization>;

/**
 * A server configuration data.
 */
export interface WingServerConfiguration {
    /**
     * The server's UUID.
     */
    uuid: string;
    /**
     * The server's metadata.
     */
    meta: {
        /**
         * The server name.
         */
        name: string;
        /**
         * The server description. Can be an empty string.
         */
        description: string;
    };
    /**
     * True if the server is suspended.
     */
    suspended: boolean;
    /**
     * The invocation script (startup script).
     */
    invocation: string;
    skip_egg_scripts: boolean;
    /**
     * The environments variables.
     *
     * It contains the server variables and more, like `P_SERVER_UUID` (server UUID) or `STARTUP` (startup script)
     */
    environment: Record<string, string>;
    /**
     * This is nullable: `unknown | null`.
     *
     * I don't know what the other values can be.
     */
    labels: unknown;
    /**
     * The allocations config.
     */
    allocations: {
        force_outgoing_ip: boolean;
        /**
         * e.g. `{ ip: '0.0.0.0', port: 4089 }`
         */
        default: { ip: string; port: number };
        /**
         * e.g. `{ '0.0.0.0': [ 4089 ] }`
         */
        mappings: Record<string, number[]>;
    };
    /**
     * The build config.
     */
    build: {
        /**
         * In MB.
         */
        memory_limit: number;
        swap: number;
        io_weight: number;
        /**
         * In percentage.
         */
        cpu_limit: number;
        /**
         * In MB.
         */
        disk_space: number;
        /**
         * Can be an empty string.
         */
        threads: string | null;
        /**
         * Out Of Memory killer.
         */
        oom_killer: boolean;
    };
    /**
     * Detects when the server crash.
     *
     * Probably what is used to auto restart
     * the server when it crashes.
     */
    crash_detection_enabled: boolean;
    /**
     * This is nullable: `unknown | null`.
     *
     * I don't know what the other values can be.
     */
    mounts: unknown;
    /**
     * The egg-related config.
     */
    egg: {
        /**
         * The egg ID.
         */
        id: string;
        /**
         * Files that cannot be edited by the user.
         */
        file_denylist: string[];
        /**
         * The egg features.
         *
         * e.g.
         *
         * ```json
         * {
         *   "eula": [
         *     "you need to agree to the eula in order to run the server"
         *   ],
         *   "gsl_token": [ "(gsl token expired)", "(account not found)" ],
         *   "java_version": [
         *     "java.lang.UnsupportedClassVersionError",
         *     "unsupported major.minor version",
         *     "has been compiled by a more recent version of the java runtime",
         *     "minecraft 1.17 requires running the server with java 16 or above",
         *     "minecraft 1.18 requires running the server with java 17 or above",
         *     "minecraft 1.19 requires running the server with java 17 or above"
         *   ],
         *   "pid_limit": [
         *     "pthread_create failed",
         *     "failed to create thread",
         *     "unable to create thread",
         *     "unable to create native thread",
         *     "unable to create new native thread",
         *     "exception in thread \"craft async scheduler management thread\""
         *   ],
         *   "steam_disk_space": [
         *     "steamcmd needs 250mb of free disk space to update",
         *     "0x202 after update job"
         *   ]
         * }
         * ```
         */
        features: Record<string, string[]> | null;
    };
    /**
     * The container config.
     */
    container: {
        /**
         * The docker image.
         *
         * e.g. `ghcr.io/parkervcp/yolks:python_3.14`
         */
        image: string;
    };
}

export const wingServerConfigurationSchema = z.object({
    uuid: z.string().min(1),
    meta: z.object({ name: z.string().min(1), description: z.string() }),
    suspended: z.boolean(),
    invocation: z.string().min(1),
    skip_egg_scripts: z.boolean(),
    environment: z.record(z.string(), z.string()),
    labels: z.unknown().nullable(),
    allocations: z.object({
        force_outgoing_ip: z.boolean(),
        default: z.object({ ip: z.string(), port: z.int() }),
        mappings: z.record(z.string(), z.array(z.int())),
    }),
    build: z.object({
        memory_limit: z.int(),
        swap: z.int(),
        io_weight: z.int(),
        cpu_limit: z.number(),
        disk_space: z.int(),
        threads: z.string().nullable(),
        oom_killer: z.boolean(),
    }),
    crash_detection_enabled: z.boolean(),
    mounts: z.unknown().nullable(),
    egg: z.object({
        id: z.string().min(1),
        file_denylist: z.array(z.string()),
        features: z.record(z.string(), z.array(z.string())).nullable(),
    }),
    container: z.object({
        image: z.string().min(1),
    }),
}) satisfies z.ZodType<WingServerConfiguration>;

/**
 * A server data.
 */
export interface WingServer {
    /**
     * The server state.
     */
    state: ServerState;
    /**
     * True if suspended.
     */
    is_suspended: boolean;
    /**
     * The utilization data.
     */
    utilization: WingServerUtilization;
    /**
     * The configuration.
     */
    configuration: WingServerConfiguration;
}

export const wingServerSchema = z.object({
    state: z.string().min(1),
    is_suspended: z.boolean(),
    utilization: wingServerUtilizationSchema,
    configuration: wingServerConfigurationSchema,
}) satisfies z.ZodType<WingServer>;

/**
 * A server logs.
 *
 * One element = one line.
 */
export interface WingServerLogs {
    data: string[];
}

export const wingServerLogsSchema = z.object({
    data: z.array(z.string()),
}) satisfies z.ZodType<WingServerLogs>;
