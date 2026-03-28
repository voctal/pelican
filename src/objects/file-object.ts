import z from "zod";
import { genericObjectSchema } from "./generic";
import { createListSchema } from "./list";

/**
 * The string value of the `object` property inside a file object.
 */
export const fileObjectObjectType = "file_object" as const;

/**
 * Represents a file object (file/folder/symlink).
 */
export interface FileObject {
    object: typeof fileObjectObjectType;
    attributes: FileObjectAttributes;
}

/**
 * Attributes of a file object.
 */
export interface FileObjectAttributes {
    /**
     * File name.
     */
    name: string;
    /**
     * Mode (e.g. `drwxr-xr-x`)
     */
    mode: string;
    /**
     * Mode bits (e.g. `755`)
     */
    mode_bits: string;
    /**
     * Size in bytes.
     */
    size: number;
    /**
     * If it is a file or a directory.
     */
    is_file: boolean;
    /**
     * If it is a symbolic link.
     */
    is_symlink: boolean;
    /**
     * Mime type (e.g `inode/directory`)
     */
    mimetype: string;
    /**
     * Creation date. ISO 8601.
     */
    created_at: string;
    /**
     * Last edit date. ISO 8601.
     */
    modified_at: string;
}

export const fileObjectSchema = genericObjectSchema.extend({
    object: z.literal(fileObjectObjectType),
    attributes: z.object({
        name: z.string(),
        mode: z.string(),
        mode_bits: z.string(),
        size: z.int(),
        is_file: z.boolean(),
        is_symlink: z.boolean(),
        mimetype: z.string(),
        created_at: z.string(),
        modified_at: z.string(),
    }),
}) satisfies z.ZodType<FileObject>;

export const fileObjectListSchema = createListSchema(fileObjectSchema);
