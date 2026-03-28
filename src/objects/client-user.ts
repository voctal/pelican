import z from "zod";
import { GenericObject, genericObjectSchema } from "./generic";
import { userObjectType } from "./user";

/**
 * Represents a client user.
 */
export interface ClientUser extends GenericObject {
    object: typeof userObjectType;
    attributes: ClientUserAttributes;
}

/**
 * Attributes of a client user object.
 */
export interface ClientUserAttributes {
    uuid: string;
    username: string;
    email: string;
    language: string;
    image: string;
    admin: boolean;
    root_admin: boolean;
    "2fa_enabled": boolean;
    created_at: string;
    updated_at: string;
}

export const clientUserSchema = genericObjectSchema.extend({
    object: z.literal(userObjectType),
    attributes: z.object({
        uuid: z.string(),
        username: z.string(),
        email: z.string(),
        language: z.string(),
        image: z.string(),
        admin: z.boolean(),
        root_admin: z.boolean(),
        "2fa_enabled": z.boolean(),
        created_at: z.string(),
        updated_at: z.string(),
    }),
}) satisfies z.ZodType<ClientUser>;
