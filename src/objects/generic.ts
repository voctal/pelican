import z from "zod";

/**
 * Represents an API object.
 */
export interface GenericObject {
    object: string;
    attributes: object;
    relationships?: object;
    meta?: object;
}

export const genericObjectSchema = z.object({
    object: z.string(),
    attributes: z.object(),
    relationships: z.record(z.string(), z.unknown()).optional(),
    meta: z.record(z.string(), z.unknown()).optional(),
});
