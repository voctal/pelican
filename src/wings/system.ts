import { Controller } from "../controller";
import { query } from "../rest/query";
import {
    System,
    SystemDockerDisk,
    SystemIPs,
    SystemUtilization,
    wingSystemDockerDiskSchema,
    wingSystemIPsSchema,
    wingSystemSchema,
    wingSystemUtilizationSchema,
} from "./system-objects";

/**
 * The request options to the system diagnostics.
 */
export interface WingGetSystemDiagnosticsOptions {
    /**
     * Include the endpoints.
     */
    include_endpoints?: boolean;
    /**
     * Include the logs.
     */
    include_logs?: boolean;
    /**
     * Number of lines to returns. 200 by default. Should be in `]0;500]`.
     */
    log_lines?: number;
}

/**
 * The wing system controller.
 *
 * - Type: Wings
 *
 * - Path: `<wing>/api/system`
 */
export class WingSystem extends Controller {
    /**
     * Returns the system data of the wing.
     *
     * Route: `GET <wing>/api/system`
     */
    public async get(): Promise<System> {
        const json = await this.client.rest.get("system");
        return wingSystemSchema.parse(json);
    }

    /**
     * Returns the system utilization.
     *
     * Route: `GET <wing>/api/system/utilization`
     */
    public async getUtilization(): Promise<SystemUtilization> {
        const json = await this.client.rest.get("system/utilization");
        return wingSystemUtilizationSchema.parse(json);
    }

    /**
     * Returns the system IPs.
     *
     * Route: `GET <wing>/api/system/ips`
     */
    public async getIPs(): Promise<SystemIPs> {
        const json = await this.client.rest.get("system/ips");
        return wingSystemIPsSchema.parse(json);
    }

    /**
     * Generates the system diagnostics.
     *
     * Route: `GET <wing>/api/system/diagnostics`
     */
    public async getDiagnostics(options: WingGetSystemDiagnosticsOptions): Promise<string> {
        const params = query(options);
        const response = await this.client.rest.rawGet(`system/diagnostics${params}`);

        return await response.text();
    }

    /**
     * Returns the docker disk data.
     *
     * Note:
     *  It seems to always take long to load (more than a second).
     *  It is probably doing heavy operations, so caching the
     *  result may be needed to not overload the wing.
     *
     * Route: `GET <wing>/api/system/docker/disk`
     */
    public async getDockerDisk(): Promise<SystemDockerDisk> {
        const json = await this.client.rest.get("system/docker/disk");
        return wingSystemDockerDiskSchema.parse(json);
    }
}
