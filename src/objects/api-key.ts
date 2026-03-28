import z from "zod";
import { GenericObject, genericObjectSchema } from "./generic";
import { createListSchema } from "./list";

/**
 * The string value of the `object` property inside an API key.
 */
export const apiKeyObjectType = "api_key" as const;

/**
 * Represents a client API key, used to interact with the Pelican API.
 */
export interface APIKey extends GenericObject {
    object: typeof apiKeyObjectType;
    attributes: APIKeyAttributes;
}

/**
 * Attributes of an API key object.
 */
export interface APIKeyAttributes {
    /**
     * Key ID. This is only the beginning of the real key,
     * as the key cannot be viewed again after creation.
     */
    identifier: string;
    /**
     * Description of the key.
     */
    description: string;
    /**
     * Allowed IPs.
     * Note that IPs can be invalid, the user can enter any string, like "hello".
     */
    allowed_ips: string[];
    /**
     * Last usage of the key. ISO 8601.
     */
    last_used_at: string | null;
    /**
     * Creation date of the key. ISO 8601.
     */
    created_at: string;
}

export const apiKeySchema = genericObjectSchema.extend({
    object: z.literal(apiKeyObjectType),
    attributes: z.object({
        identifier: z.string(),
        description: z.string(),
        allowed_ips: z.array(z.string()),
        last_used_at: z.string().nullable(),
        created_at: z.string(),
    }),
}) satisfies z.ZodType<APIKey>;

/**
 * An API key returned by the API after creation, with `secret_token` metadata.
 */
export type CreatedAPIKey = APIKey & {
    meta: {
        /**
         * The full API key token.
         */
        secret_token: string;
    };
};

export const createdApiKeySchema = genericObjectSchema.extend({
    object: z.literal(apiKeyObjectType),
    attributes: z.object({
        identifier: z.string(),
        description: z.string(),
        allowed_ips: z.array(z.string()),
        last_used_at: z.string().nullable(),
        created_at: z.string(),
    }),
    meta: z.object({
        secret_token: z.string(),
    }),
}) satisfies z.ZodType<CreatedAPIKey>;

export const apiKeyListSchema = createListSchema(apiKeySchema);
