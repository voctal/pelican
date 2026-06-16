import z from "zod";
import { genericObjectSchema } from "./generic";
import { createGenericListSchema, createListSchema } from "./list";

/**
 * The string value of the `object` property inside a mount object.
 */
export const mountObjectType = "mount" as const;

/**
 * Represents a mount object.
 */
export interface Mount {
    object: typeof mountObjectType;
    attributes: MountAttributes;
}

/**
 * Attributes of a mount.
 */
export interface MountAttributes {
    /**
     * The mount panel ID.
     */
    id: number;
    /**
     * The mount wing UUID.
     */
    uuid: string;
    /**
     * The mount name. 2-64 characters, unique.
     */
    name: string;
    /**
     * The mount description. Max 255 characters.
     */
    description: string | null;
    /**
     * The mount source path on the filesystem (host system path).
     */
    source: string;
    /**
     * The target path. Where the mount is mounted on the users servers (container path).
     */
    target: string;
    /**
     * If the files inside the mount are read-only.
     */
    read_only: boolean;
    /**
     * If the users can mount it themselves on the panel.
     */
    user_mountable: boolean;
}

export const mountSchema = genericObjectSchema.extend({
    object: z.literal(mountObjectType),
    attributes: z.object({
        id: z.int(),
        uuid: z.string().min(1),
        name: z.string().min(1),
        description: z.string().nullable(),
        source: z.string().min(1),
        target: z.string().min(1),
        read_only: z.boolean(),
        user_mountable: z.boolean(),
    }),
}) satisfies z.ZodType<Mount>;

export const mountGenericListSchema = createGenericListSchema(mountSchema);

export const mountListSchema = createListSchema(mountSchema);
