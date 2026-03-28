/**
 * Transforms a record into query params.
 */
export const query = (options: object | undefined): string => {
    if (!options) return "";

    const qs = new URLSearchParams();

    for (const [k, v] of Object.entries(options)) {
        if (typeof v !== "string" || typeof v !== "number") continue;
        qs.set(k, `${v}`);
    }

    if ("filters" in options && options.filters) {
        for (const [k, v] of Object.entries(options.filters)) {
            if (!v) continue;
            qs.set(`filter[${k}]`, v.toString());
        }
    }

    if ("include" in options && options.include) {
        const includes = [];
        for (const [k, v] of Object.entries(options.include)) {
            if (!v) continue;
            includes.push(k);
        }
        qs.set("include", includes.join(","));
    }

    const stringified = `${qs}`;
    return stringified ? `?${stringified}` : "";
};
