import z from "zod";

/**
 * Represents a websocket token.
 */
export interface WebSocketToken {
    data: WebSocketTokenData;
}

/**
 * Data of a websocket token object.
 */
export interface WebSocketTokenData {
    /**
     * The websocket JWT token.
     */
    token: string;
    /**
     * The socket URL (e.g. `wss://node.panel.com:8080/api/servers/d3aac109-e5e0-4331-b03e-3454f7e02bbe/ws`)
     */
    socket: string;
}

export const webSocketTokenSchema = z.object({
    data: z.object({
        token: z.string().min(1),
        socket: z.string().min(1),
    }),
}) satisfies z.ZodType<WebSocketToken>;
