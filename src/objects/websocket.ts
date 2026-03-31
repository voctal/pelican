import z from "zod";
import { ServerState } from "./stats";

/**
 * A WebSocket message.
 */
export interface WebSocketMessage {
    /**
     * The event name.
     */
    event: string;
    /**
     * The event arguments.
     *
     * This can be missing for some events, like `auth success`.
     */
    args?: string[];
}

/**
 * Pelican websocket events.
 */
export enum WebSocketEvents {
    /**
     * Client -> Server
     */
    Auth = "auth",
    /**
     * Client -> Server
     */
    SetState = "set state",
    /**
     * Client -> Server
     */
    SendCommand = "send command",
    /**
     * Server -> Client
     */
    AuthSuccess = "auth success",
    /**
     * Server -> Client
     */
    ConsoleOutput = "console output",
    /**
     * Server -> Client
     */
    Status = "status",
    /**
     * Server -> Client
     */
    Stats = "stats",
    /**
     * Server -> Client
     */
    JWTError = "jwt error",
    /**
     * Server -> Client
     */
    DaemonMessage = "daemon message",
}

export interface WebSocketEventMap {
    "auth success": never[];
    "console output": [string];
    status: [ServerState];
    stats: [WebSocketStatsEventData];
    "jwt error": [string];
    "daemon message": [string];
    /**
     * WebSocket error.
     */
    error: [Error];
    /**
     * WebSocket close event.
     */
    close: [number];
}

export const webSocketMessageSchema = z.object({
    event: z.string(),
    args: z.array(z.string()).optional(),
}) satisfies z.ZodType<WebSocketMessage>;

/**
 * Server resources in a websocket `stats` event message.
 */
export interface WebSocketStatsEventData {
    /**
     * The current state of the server.
     */
    state: ServerState;
    /**
     * Current memory usage in bytes.
     */
    memory_bytes: number;
    /**
     * Current memory limit in bytes.
     */
    memory_limit_bytes: number;
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
     * Network resources.
     */
    network: {
        /**
         * Total bytes received.
         */
        rx_bytes: number;
        /**
         * Total bytes transmitted.
         */
        tx_bytes: number;
    };
    /**
     * Server uptime in milliseconds.
     */
    uptime: number;
}

export const webSocketStatsEventDataSchema = z.object({
    state: z.string(),
    memory_bytes: z.int(),
    memory_limit_bytes: z.int(),
    cpu_absolute: z.number(),
    disk_bytes: z.int(),
    network: z.object({
        rx_bytes: z.int(),
        tx_bytes: z.int(),
    }),
    uptime: z.int(),
}) satisfies z.ZodType<WebSocketStatsEventData>;
