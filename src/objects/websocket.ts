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
     * This can be missing for some events like `auth success`, or arguments can be null for some events like `send logs`.
     */
    args?: (string | null)[];
}

/**
 * Pelican websocket events.
 */
export enum WebSocketEvents {
    /**
     * Authenticate with JWT token
     *
     * - Arguments: [token: string]
     *
     * - Direction: `Client -> Server`
     */
    Auth = "auth",
    /**
     * Change server power state
     *
     * - Arguments: [state: ServerState]
     *
     * - Direction: `Client -> Server`
     */
    SetState = "set state",
    /**
     * Send console command
     *
     * - Arguments: [command: string]
     *
     * - Direction: `Client -> Server`
     */
    SendCommand = "send command",
    /**
     * Ask for the server logs (useful when connecting to the WS)
     *
     * - Arguments: [null]
     *
     * - Direction: `Client -> Server`
     */
    SendLogs = "send logs",
    /**
     * Successful authentication
     *
     * - Arguments: none
     *
     * - Direction: `Server -> Client`
     */
    AuthSuccess = "auth success",
    /**
     * Console output/logs
     *
     * - Arguments: [log: string]
     *
     * - Direction: `Server -> Client`
     */
    ConsoleOutput = "console output",
    /**
     * Server status updates
     *
     * - Arguments: [status: string]
     *
     * - Direction: `Server -> Client`
     */
    Status = "status",
    /**
     * Resource usage statistics
     *
     * - Arguments: [stats: stringified WebSocketStatsEventData]
     *
     * - Direction: `Server -> Client`
     */
    Stats = "stats",
    /**
     * Authentication error
     *
     * - Arguments: [error: string]
     *
     * - Direction: `Server -> Client`
     */
    JWTError = "jwt error",
    /**
     * System messages
     *
     * - Arguments: [log: string]
     *
     * - Direction: `Server -> Client`
     */
    DaemonMessage = "daemon message",
}

/**
 * The WebSocket event map for `PelicanWebSocket`.
 */
export interface WebSocketEventMap {
    [WebSocketEvents.Auth]: never[];
    [WebSocketEvents.ConsoleOutput]: [string];
    [WebSocketEvents.Status]: [ServerState];
    [WebSocketEvents.Stats]: [WebSocketStatsEventData];
    [WebSocketEvents.JWTError]: [string];
    [WebSocketEvents.DaemonMessage]: [string];
    /**
     * Native WebSocket "open" event
     */
    open: never[];
    /**
     * An error occured. Also re-emit all the errors from the underlying native WebSocket.
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
