import { Controller } from "../controller";
import { ClientUser, clientUserSchema } from "../objects/client-user";

/**
 * The account controller.
 *
 * - Type: Client
 *
 * - Path: `/api/client/account`
 */
export class Account extends Controller {
    /**
     * Get the account details.
     *
     * Route: `GET /api/client/account`
     */
    public async get(): Promise<ClientUser> {
        const json = await this.client.rest.get("client/account");
        return clientUserSchema.parse(json);
    }
}
