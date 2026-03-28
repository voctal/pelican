import { Controller } from "../controller";
import { APIKey, apiKeyListSchema, CreatedAPIKey, createdApiKeySchema } from "../objects/api-key";
import { List } from "../objects/list";
import { PelicanError } from "../rest/errors";

/**
 * The request options to create an api key.
 */
export interface APIKeyCreateOptions {
    /**
     * Length: `<= 500`
     */
    description: string;
    /**
     * Length: `<= 50`
     */
    allowed_ips?: string[];
}

/**
 * The api keys controller.
 *
 * - Type: Client
 *
 * - Path: `/api/client/account/api-keys`
 */
export class APIKeys extends Controller {
    /**
     * Returns all the API keys that exist for the given client.
     *
     * Route: `GET /api/client/account/api-keys`
     */
    public async list(): Promise<List<APIKey>> {
        const json = await this.client.rest.get("client/account/api-keys");
        return apiKeyListSchema.parse(json);
    }

    /**
     * Create a new API key for a user's account.
     * The full token is returned in `meta.secret_token`.
     *
     * Route: `POST /api/client/account/api-keys`
     */
    public async create(options: APIKeyCreateOptions): Promise<CreatedAPIKey> {
        const json = await this.client.rest.post("client/account/api-keys", options);
        return createdApiKeySchema.parse(json);
    }

    /**
     * Deletes the given API key.
     *
     * Route: `DELETE /api/client/account/api-keys/{identifier}`
     */
    public async delete(identifier: string) {
        const response = await this.client.rest.rawDelete(`client/account/api-keys/${identifier}`);

        if (response.status !== 204) {
            throw new PelicanError({
                message: "Failed to delete an API key, the API did not return a 204",
                response: response,
            });
        }
    }
}
