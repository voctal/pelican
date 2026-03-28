export type Filters<T extends Record<string, string> = Record<string, string>> = Partial<T>;

export type Sorter<T extends string> = T | `-${T}`;

export type Includes<T extends string> = Record<T, boolean>;
