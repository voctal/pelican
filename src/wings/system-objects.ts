import { z } from "zod";

/**
 * The wing system data.
 */
export interface System {
    /**
     * `amd64`
     */
    architecture: string;
    /**
     * CPU core count.
     */
    cpu_count: number;
    /**
     * The OS kernel version, e.g. `6.8.0-86-generic`
     */
    kernel_version: string;
    /**
     * The OS name, e.g. `linux`.
     */
    os: string;
    /**
     * The Pelican version, e.g. `1.0.0-beta24`
     */
    version: string;
}

export const wingSystemSchema = z.object({
    architecture: z.string().min(1),
    cpu_count: z.int(),
    kernel_version: z.string().min(1),
    os: z.string().min(1),
    version: z.string().min(1),
}) satisfies z.ZodType<System>;

/**
 * The wing system utilization data.
 *
 * Cached 360 seconds (6min).
 */
export interface SystemUtilization {
    /**
     * In bytes.
     */
    memory_total: number;
    /**
     * In bytes.
     */
    memory_used: number;
    swap_total: number;
    swap_used: number;
    /**
     * Load average the last minute.
     * Float.
     */
    load_average1: number;
    /**
     * Load average the last 5 minutes.
     * Float.
     */
    load_average5: number;
    /**
     * Load average the last 15 minutes.
     * Float.
     */
    load_average15: number;
    /**
     * CPU usage percentage.
     */
    cpu_percent: number;
    /**
     * In bytes.
     */
    disk_total: number;
    /**
     * In bytes.
     */
    disk_used: number;
    disk_details: SystemUtilizationDiskDetails[];
}

/**
 * The wing disk utilization details.
 */
export interface SystemUtilizationDiskDetails {
    /**
     * e.g. `/dev/sda1`
     */
    device: string;
    /**
     * e.g. `/`, `/boot/efi`
     */
    mountpoint: string;
    /**
     * In bytes.
     */
    total_space: number;
    /**
     * In bytes.
     */
    used_space: number;
    /**
     * e.g. `[]`, `[ 'Backup', 'Temp', 'Root', 'Logs', 'Data', 'Archive' ]`
     */
    tags: string[];
}

export const wingSystemUtilizationDiskDetailsSchema = z.object({
    device: z.string().min(1),
    mountpoint: z.string().min(1),
    total_space: z.int(),
    used_space: z.int(),
    tags: z.array(z.string()),
}) satisfies z.ZodType<SystemUtilizationDiskDetails>;

export const wingSystemUtilizationSchema = z.object({
    memory_total: z.int(),
    memory_used: z.int(),
    swap_total: z.int(),
    swap_used: z.int(),
    load_average1: z.number(),
    load_average5: z.number(),
    load_average15: z.number(),
    cpu_percent: z.number(),
    disk_total: z.int(),
    disk_used: z.int(),
    disk_details: z.array(wingSystemUtilizationDiskDetailsSchema),
}) satisfies z.ZodType<SystemUtilization>;

/**
 * The wing's available IPs.
 */
export interface SystemIPs {
    /**
     * Available IP addresses on the node.
     *
     * e.g. `[node real ip, '172.17.0.1', '172.18.0.1', ipv6 addresses]`
     */
    ip_addresses: string[];
}

export const wingSystemIPsSchema = z.object({
    ip_addresses: z.array(z.string()),
}) satisfies z.ZodType<SystemIPs>;

/**
 * The docker disk data.
 */
export interface SystemDockerDisk {
    /**
     * Total size of all containers, in bytes.
     *
     * Type: `int64`
     */
    containers_size: number;
    /**
     * Total number of images.
     *
     * Type: `int`
     */
    images_total: number;
    /**
     * Number of images with running containers.
     *
     * Type: `int64`
     */
    images_active: number;
    /**
     * Total size of image layers.
     *
     * Type: `int64`
     */
    images_size: number;
    /**
     * Size of build cache (non-shared).
     *
     * Type: `int64`
     */
    build_cache_size: number;
}

export const wingSystemDockerDiskSchema = z.object({
    containers_size: z.int(),
    images_total: z.int(),
    images_active: z.int(),
    images_size: z.int(),
    build_cache_size: z.int(),
}) satisfies z.ZodType<SystemDockerDisk>;
