import z from "zod";
import { GenericObject, genericObjectSchema } from "./generic";
import { createListSchema } from "./list";

/**
 * The string value of the `object` property inside an egg variable.
 */
export const eggVariableObjectType = "egg_variable" as const;

/**
 * Represents an egg variable.
 */
export interface EggVariable extends GenericObject {
    object: typeof eggVariableObjectType;
    attributes: EggVariableAttributes;
}

/**
 * Attributes of an egg variable object.
 */
export interface EggVariableAttributes {
    /**
     * 	Human-readable variable name.
     */
    name: string;
    /**
     * Description of what the variable controls.
     */
    description: string;
    /**
     * Environment variable name used in startup command.
     */
    env_variable: string;
    /**
     * Default value defined by the egg. Can be empty.
     */
    default_value: string;
    /**
     * Current value set for this server. Can be empty.
     */
    server_value: string;
    /**
     * Whether the variable can be modified by users.
     */
    is_editable: boolean;
    /**
     * Validation rules for the variable value (e.g. "nullable|string")
     */
    rules: string;
}

export const eggVariableSchema = genericObjectSchema.extend({
    object: z.literal(eggVariableObjectType),
    attributes: z.object({
        name: z.string(),
        description: z.string(),
        env_variable: z.string(),
        default_value: z.string(),
        server_value: z.string(),
        is_editable: z.boolean(),
        rules: z.string(),
    }),
}) satisfies z.ZodType<EggVariable>;

export const eggVariableListSchema = createListSchema(eggVariableSchema);
