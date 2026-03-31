import assert from "node:assert";
import EventEmitter from "node:events";
import { PelicanClient } from "../client/client";
import { PowerAction } from "../client/client-servers";
import {
    WebSocketEventMap,
    WebSocketEvents,
    WebSocketMessage,
    webSocketMessageSchema,
    webSocketStatsEventDataSchema,
} from "../objects/websocket";
import { WebSocketToken, WebSocketTokenData, webSocketTokenSchema } from "../objects/websocket-token";

/**
 * The WebSocket API wrapper class. The user needs the `websocket.connect` permission to get auth tokens.
 *
 * Note: WebSocket connections require a JWT token obtained through the Client API.
 * The token provides temporary access with a 10-minute expiration and must be refreshed periodically.
 */
export class PelicanWebSocket extends EventEmitter<WebSocketEventMap> {
    /**
     * The socket.
     */
    public socket: WebSocket | null = null;

    public reconnectAttempts: number = 0;
    public maxReconnectAttempts: number = 5;
    public reconnectDelay: number = 1000;
    public isConnecting: boolean = false;

    public constructor(
        public readonly client: PelicanClient,
        public readonly serverId: string,
    ) {
        super();
    }

    /**
     * Get a WebSocket token to create a new session.
     * Tokens expires 10 minutes after creation.
     *
     * Route: `GET /api/client/servers/{server}/websocket`
     */
    public async getToken(): Promise<WebSocketToken> {
        const json = await this.client.rest.get(`client/servers/${this.serverId}/websocket`);
        return webSocketTokenSchema.parse(json);
    }

    /**
     * Connect to the gateway. This will instantiate `PelicanWebSocket#socket`.
     *
     * If successful, you should receive the `auth success` and `status` events.
     *
     * @param data - The data obtained from `getToken`
     */
    public async connect(data?: WebSocketTokenData) {
        if (this.isConnecting) return;
        this.isConnecting = true;

        try {
            const tokenData = data || (await this.getToken()).data;

            this.socket = new WebSocket(tokenData.socket, {
                headers: {
                    Authorization: `Bearer ${tokenData.token}`,
                    Origin: this.client.url,
                },
            });

            this.socket.onopen = () => {
                this.sendMessage({ event: WebSocketEvents.Auth, args: [tokenData.token] });
            };

            this.socket.onmessage = event => {
                try {
                    const raw = JSON.parse(event.data);
                    const data = webSocketMessageSchema.parse(raw);
                    this.handleMessage(data);
                } catch (err) {
                    const error = err instanceof Error ? err : new Error("WebSocket onmessage error", { cause: err });
                    this.emit("error", error);
                }
            };

            this.socket.onclose = event => {
                try {
                    this.handleClose(event);
                } catch (err) {
                    const error = err instanceof Error ? err : new Error("WebSocket onmessage error", { cause: err });
                    this.emit("error", error);
                }
            };

            this.socket.onerror = event => {
                this.emit("error", event.error);
            };
        } catch (err) {
            const error = err instanceof Error ? err : new Error("WebSocket connect error", { cause: err });
            this.emit("error", error);
            this.scheduleReconnect();
        } finally {
            this.isConnecting = false;
        }
    }

    /**
     * Close the connection. Does nothing if already closed.
     */
    public close(code = 1000) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.close(code, "Manual close");
        }
    }

    /**
     * Send a command to the server.
     */
    public sendCommand(command: string) {
        this.sendMessage({
            event: WebSocketEvents.SendCommand,
            args: [command],
        });
    }

    /**
     * Set the state of the server.
     */
    public sendPowerState(state: PowerAction) {
        this.sendMessage({
            event: WebSocketEvents.SetState,
            args: [state],
        });
    }

    /**
     * Send a message through the WebSocket.
     *
     * @throws Error if the socket is not open
     */
    public sendMessage(data: WebSocketMessage) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            throw new Error("Cannot send a message when the socket is not open");
        }
        this.socket.send(JSON.stringify(data));
    }

    private scheduleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            return;
        }

        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
        this.reconnectAttempts++;

        setTimeout(async () => {
            await this.connect();
        }, delay);
    }

    /**
     * Handles message event.
     */
    private handleMessage(message: WebSocketMessage) {
        switch (message.event) {
            case "auth success": {
                this.emit(WebSocketEvents.AuthSuccess);
                break;
            }
            case "console output": {
                const log = message.args?.[0];
                assert(log, `received the '${message.event}' event but without any arguments`);

                this.emit(WebSocketEvents.ConsoleOutput, log);
                break;
            }
            case "status": {
                const newState = message.args?.[0];
                assert(newState, `received the '${message.event}' event but without any arguments`);

                this.emit(WebSocketEvents.Status, newState);
                break;
            }
            case "stats": {
                const raw = message.args?.[0];
                assert(raw, `received the '${message.event}' event but without any arguments`);

                const stats = webSocketStatsEventDataSchema.parse(JSON.parse(raw));
                this.emit(WebSocketEvents.Stats, stats);
                break;
            }
            case "jwt error": {
                const error = message.args?.[0];
                assert(error, `received the '${message.event}' event but without any arguments`);

                this.emit(WebSocketEvents.JWTError, error);
                break;
            }
            case "daemon message": {
                const log = message.args?.[0];
                assert(log, `received the '${message.event}' event but without any arguments`);

                this.emit(WebSocketEvents.DaemonMessage, log);
                break;
            }
            default: {
                this.emit(message.event, ...(message.args || []));
                break;
            }
        }
    }

    /**
     * Handles close event.
     */
    private handleClose(event: CloseEvent) {
        this.emit("close", event.code);

        switch (event.code) {
            case 1006:
                // Abnormal closure
                // setTimeout(reconnectWebSocket, 5000);
                break;
            case 4001:
                // Auth failed
                break;
            case 4004:
                // Token expired
                // refreshAndReconnect();
                break;
        }
    }
}
