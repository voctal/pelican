import z from "zod";
import { GenericObject, genericObjectSchema } from "./generic";
import { createListSchema } from "./list";

/**
 * The string value of the `object` property inside an allocation.
 */
export const allocationObjectType = "allocation" as const;

/**
 * Represents a server allocation.
 */
export interface Allocation extends GenericObject {
    object: typeof allocationObjectType;
    attributes: AllocationAttributes;
}

/**
 * Attributes of an allocation object.
 */
export interface AllocationAttributes {
    /**
     * Unique allocation identifier.
     */
    id: number;
    /**
     * IP address of the allocation.
     */
    ip: string;
    /**
     * Friendly name/hostname for the IP.
     */
    ip_alias: string | null;
    /**
     * Port number.
     */
    port: number;
    /**
     * User-defined notes for the allocation.
     */
    notes: string | null;
    /**
     * Whether this is the primary allocation.
     */
    is_default: boolean;
}

export const allocationSchema = genericObjectSchema.extend({
    object: z.literal(allocationObjectType),
    attributes: z.object({
        id: z.int(),
        ip: z.string(),
        ip_alias: z.string().nullable(),
        port: z.int(),
        notes: z.string().nullable(),
        is_default: z.boolean(),
    }),
}) satisfies z.ZodType<Allocation>;

export const allocationListSchema = createListSchema(allocationSchema);
