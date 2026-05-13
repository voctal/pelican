import { Controller } from "../controller";
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
