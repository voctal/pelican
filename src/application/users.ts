import { Controller } from "../controller";
import { List } from "../objects/list";
import { CreatedUser, createdUserSchema, User, userListSchema, userSchema } from "../objects/user";
import { PelicanError } from "../rest/errors";
import { query } from "../rest/query";
import { Filters, Includes, Sorter } from "../utils";

export interface UserListOptions {
    /**
     * Page number for pagination.
     */
    page?: number;
    /**
     * Results per page (1-100)
     */
    per_page?: number;
    /**
     * Filter by fields.
     */
    filters?: Filters<{
        email: string;
        uuid: string;
        username: string;
        external_id: string;
    }>;
    /**
     * Sort by fields.
     */
    sort?: Sorter<"id" | "uuid" | "username" | "email" | "created_at" | "updated_at">;
    /**
     * Include relationships.
     */
    include?: Includes<"servers" | string>;
}

export interface UserCreateOptions {
    /**
     * Must be unique
     */
    email: string;
    external_id?: string | null;
    is_managed_externally?: boolean;
    /**
     * Must be unique
     */
    username: string;
    /**
     * If not provided, user must reset
     */
    password?: string | null;
    /**
     * default: en
     */
    language?: string;
    timezone?: string;
}

export class Users extends Controller {
    /**
     * List all users on the panel.
     *
     * Route: `GET /api/application/users`
     */
    public async list(options?: UserListOptions): Promise<List<User>> {
        const params = query(options);
        const json = await this.client.rest.get(`application/users${params}`);

        return userListSchema.parse(json);
    }

    /**
     * Get a single user.
     *
     * Route: `GET /api/application/users/{user}`
     */
    public async get(id: number): Promise<User> {
        const json = await this.client.rest.get(`application/users/${id}`);
        return userSchema.parse(json);
    }

    /**
     * Retrieve a specific user from the database using their external ID.
     *
     * Route: `GET /api/application/users/external/{external_id}`
     */
    public async getByExternalId(externalId: string): Promise<User> {
        const json = await this.client.rest.get(`application/users/external/${externalId}`);
        return userSchema.parse(json);
    }

    /**
     * Store a new user on the system.
     *
     * Route: `POST /application/users`
     */
    public async create(options: UserCreateOptions): Promise<CreatedUser> {
        const json = await this.client.rest.post("application/users", options);
        return createdUserSchema.parse(json);
    }

    /**
     * Update an existing user on the system.
     *
     * Route: `PATCH /api/application/users/{user}`
     */
    public async update(id: number, options: UserCreateOptions): Promise<User> {
        const json = await this.client.rest.patch(`application/users/${id}`, options);
        return userSchema.parse(json);
    }

    /**
     * Delete a user from the panel.
     *
     * Route: `DELETE /api/application/users/{user}`
     */
    public async delete(id: number) {
        const response = await this.client.rest.rawDelete(`application/users/${id}`);

        if (response.status !== 204) {
            throw new PelicanError({
                message: "Failed to delete user, the API did not return a 204",
                response: response,
            });
        }
    }
}
