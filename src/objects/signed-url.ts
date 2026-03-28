import z from "zod";
import { GenericObject, genericObjectSchema } from "./generic";

/**
 * The string value of the `object` property inside a signed URL.
 */
export const signedURLObjectType = "signed_url" as const;

/**
 * Represents a signed URL.
 */
export interface SignedURL extends GenericObject {
    object: typeof signedURLObjectType;
    attributes: SignedURLAttributes;
}

/**
 * Attributes of a signed URL object.
 */
export interface SignedURLAttributes {
    /**
     * The signed URL.
     */
    url: string;
}

export const signedURLSchema = genericObjectSchema.extend({
    object: z.literal(signedURLObjectType),
    attributes: z.object({
        url: z.string(),
    }),
}) satisfies z.ZodType<SignedURL>;
