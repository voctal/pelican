import z from "zod";

/**
 * A node API configuration.
 */
export interface NodeConfigurationAPI {
    /**
     * Host IP, e.g. `0.0.0.0`
     */
    host: string;
    /**
     * Node port, e.g. `8080`
     */
    port: number;
    ssl: {
        /**
         * If the SSL is enabled for the node API.
         */
        enabled: boolean;
        /**
         * SSL certificate file path.
         *
         * e.g. `/etc/letsencrypt/live/example.com/fullchain.pem`
         *
         * NOTE: Not sure if this can really be null.
         */
        cert: string | null;
        /**
         * SSL certificate key file path.
         *
         * e.g. `/etc/letsencrypt/live/example.com/privkey.pem`
         *
         * NOTE: Not sure if this can really be null.
         */
        key: string | null;
    };
    /**
     * In MB.
     */
    upload_limit: number;
}

export const nodeConfigurationAPISchema = z.object({
    host: z.string().min(1),
    port: z.int(),
    ssl: z.object({
        enabled: z.boolean(),
        cert: z.string().min(1).nullable(),
        key: z.string().min(1).nullable(),
    }),
    upload_limit: z.int(),
}) satisfies z.ZodType<NodeConfigurationAPI>;

/**
 * A node system configuration.
 */
export interface NodeConfigurationSystem {
    /**
     * Where the node data are stored, e.g. `/var/lib/pelican/volumes`
     */
    data: string;
    /**
     * The SFTP configuration.
     */
    sftp: {
        /**
         * The SFTP port, e.g. `2022`
         */
        bind_port: number;
    };
}

export const nodeConfigurationSystemSchema = z.object({
    data: z.string().min(1),
    sftp: z.object({
        bind_port: z.int(),
    }),
}) satisfies z.ZodType<NodeConfigurationSystem>;

/**
 * A node configuration data.
 */
export interface NodeConfiguration {
    /**
     * If the node is in debug mode.
     */
    debug: boolean;
    /**
     * The UUID of the node.
     */
    uuid: string;
    /**
     * The node token ID.
     */
    token_id: string;
    /**
     * The node token.
     */
    token: string;
    /**
     * The API configuration;
     */
    api: NodeConfigurationAPI;
    /**
     * The system configuration.
     */
    system: NodeConfigurationSystem;
    /**
     * The allowed mounts.
     *
     * TODO: type this.
     */
    allowed_mounts: unknown[];
    /**
     * The panel remote URL.
     *
     * e.g. `https://example.com`
     */
    remote: string;
}

export const nodeConfigurationSchema = z.object({
    debug: z.boolean(),
    uuid: z.string().min(1),
    token_id: z.string().min(1),
    token: z.string().min(1),
    api: nodeConfigurationAPISchema,
    system: nodeConfigurationSystemSchema,
    allowed_mounts: z.array(z.unknown()),
    remote: z.string().min(1),
}) satisfies z.ZodType<NodeConfiguration>;
