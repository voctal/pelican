import z from "zod";
import { genericObjectSchema } from "./generic";
import { createGenericListSchema, createListSchema } from "./list";

/**
 * The string value of the `object` property inside an egg object.
 */
export const eggObjectType = "egg" as const;

/**
 * Represents an egg object.
 */
export interface Egg {
    object: typeof eggObjectType;
    attributes: EggAttributes;
}

/**
 * Attributes of an egg.
 */
export interface EggAttributes {
    /**
     * The egg panel ID.
     */
    id: number;
    /**
     * The egg wing UUID.
     */
    uuid: string;
    /**
     * The mount name. 2-255 characters.
     */
    name: string;
    /**
     * Author email.
     */
    author: string;
    /**
     * The egg description.
     */
    description: string | null;
    /**
     * The egg icon. e.g. `https://example.com/storage/icons/egg/cbd15054-262b-4183-82e9-462c3894175b.png` where example.com is the panel domain.
     */
    icon: string | null;
    features: string[] | null;
    tags: string[] | null;
    /**
     * Map of display names to Docker image URIs
     */
    docker_images: Record<string, string>;
    /**
     * List of available startup commands.
     */
    startup_commands: Record<string, string>;
    config: {
        /**
         * Instructions for modifying config files.
         */
        files: object;
        /**
         * Patterns to detect server boot completion.
         */
        startup: object;
        /**
         * Stop command. Max 255 characters (if not inheriting)
         */
        stop: string;
        /**
         * Log parsing configuration.
         */
        logs: object;
        /**
         * Files users cannot edit.
         */
        file_denylist: string[] | null;
        /**
         * Parent egg ID for inheritance.
         */
        extends: number | null;
    };
    script: {
        /**
         * Whether script runs with privileges.
         */
        privileged: boolean;
        /**
         * Bash installation script.
         */
        install: string;
        /**
         * Script entry point.
         */
        entry: string;
        /**
         * Docker image for installation.
         */
        container: string;
        /**
         * Parent egg ID for script inheritance.
         */
        extends: number | null;
    };
    /**
     * ISO 8601 timestamp.
     */
    created_at: string;
    /**
     * ISO 8601 timestamp.
     */
    updated_at: string;
}

export const eggSchema = genericObjectSchema.extend({
    object: z.literal(eggObjectType),
    attributes: z.object({
        id: z.int(),
        uuid: z.string().min(1),
        name: z.string().min(1),
        author: z.string().min(1),
        description: z.string().nullable(),
        icon: z.string().nullable(),
        features: z.array(z.string()).nullable(),
        tags: z.array(z.string()).nullable(),
        docker_images: z.record(z.string(), z.string()),
        startup_commands: z.record(z.string(), z.string()),
        config: z.object({
            files: z.array(z.unknown()).or(z.object()),
            startup: z.array(z.unknown()).or(z.object()),
            stop: z.string(),
            logs: z.array(z.unknown()).or(z.object()),
            file_denylist: z.array(z.string()).nullable(),
            extends: z.int().nullable(),
        }),
        script: z.object({
            privileged: z.boolean(),
            install: z.string(),
            entry: z.string(),
            container: z.string(),
            extends: z.int().nullable(),
        }),
        created_at: z.string(),
        updated_at: z.string(),
    }),
}) satisfies z.ZodType<Egg>;

export const eggGenericListSchema = createGenericListSchema(eggSchema);

export const eggListSchema = createListSchema(eggSchema);
