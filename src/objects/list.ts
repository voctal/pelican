import z from "zod";

/**
 * The string value of the `object` property inside a list object.
 */
export const listObjectType = "list" as const;

/**
 * Represents a list object, without the pagination metadata.
 */
export interface GenericList<T> {
    object: typeof listObjectType;
    data: T[];
}

/**
 * Represents a list object.
 */
export interface List<T> extends GenericList<T> {
    meta: ListMeta;
}

/**
 * The list object metadata.
 */
export interface ListMeta {
    pagination: {
        total: number;
        count: number;
        per_page: number;
        current_page: number;
        total_pages: number;
        links: Record<string, unknown>;
    };
}

export const createGenericListSchema = <T extends z.ZodType>(innerSchema: T) => {
    return z.object({
        object: z.literal(listObjectType),
        data: z.array(innerSchema),
    });
};

export const createListSchema = <T extends z.ZodType>(innerSchema: T) => {
    return z.object({
        object: z.literal(listObjectType),
        data: z.array(innerSchema),
        meta: z.object({
            pagination: z.object({
                total: z.int(),
                count: z.int(),
                per_page: z.int(),
                current_page: z.int(),
                total_pages: z.int(),
                links: z.record(z.string(), z.unknown()),
            }),
        }),
    });
};
