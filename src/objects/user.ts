import z from "zod";
import { GenericObject, genericObjectSchema } from "./generic";
import { createListSchema } from "./list";

/**
 * The string value of the `object` property inside a user.
 */
export const userObjectType = "user" as const;

/**
 * Represents a Pelican user.
 */
export interface User extends GenericObject {
    object: typeof userObjectType;
    attributes: UserAttributes;
}

/**
 * Attributes of a user.
 */
export interface UserAttributes {
    id: number;
    external_id: string | null;
    is_managed_externally: boolean;
    uuid: string;
    username: string;
    email: string;
    language: string;
    root_admin: boolean;
    "2fa_enabled": boolean;
    "2fa": boolean;
    created_at: string;
    updated_at: string;
}

export const userSchema = genericObjectSchema.extend({
    object: z.literal(userObjectType),
    attributes: z.object({
        id: z.int(),
        external_id: z.string().nullable(),
        is_managed_externally: z.boolean(),
        uuid: z.string(),
        username: z.string(),
        email: z.string(),
        language: z.string(),
        root_admin: z.boolean(),
        "2fa_enabled": z.boolean(),
        "2fa": z.boolean(),
        created_at: z.string(),
        updated_at: z.string(),
    }),
}) satisfies z.ZodType<User>;

export type CreatedUser = User & {
    meta: {
        /**
         * The user API url (`https://example.com/api/application/users/2`)
         */
        resource: string;
    };
};

export const createdUserSchema = userSchema.and(
    z.object({
        meta: z.object({
            resource: z.string(),
        }),
    }),
) satisfies z.ZodType<CreatedUser>;

export const userListSchema = createListSchema(userSchema);
