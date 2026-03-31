import { Client } from "../client";
import { PelicanError } from "./errors";

/**
 * An API request options.
 */
export interface RequestOptions {
    method?: string;
    /**
     * The API path without the beginning slash (e.g. `client/account` or `application/servers`)
     */
    path: string;
    body?: unknown;
}

/**
 * The options for a POST request to a signed URL.
 */
export interface PostSignedURLOptions {
    url: string;
    form: FormData;
}

/**
 * The REST wrapper to interact with the API.
 */
export class REST {
    /**
     * The base API url (e.g. `https://example.com/api`)
     */
    public readonly apiURL: string;

    public constructor(public readonly client: Client) {
        this.apiURL = `${client.url}/api`;
    }

    /**
     * Send a request to the API.
     */
    public async request({ method, path, body }: RequestOptions): Promise<Response> {
        const object: Record<string, string> = {
            Authorization: `Bearer ${this.client.token}`,
            Accept: "application/json",
            Origin: this.client.url,
        };

        if (body) {
            if (typeof body === "string") {
                object["Content-Type"] = "text/plain";
            } else {
                object["Content-Type"] = "application/json";
            }
        }

        const response = await fetch(`${this.apiURL}/${path}`, {
            method: method || "GET",
            headers: object,
            body: body ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
        });

        if (!response.ok) {
            throw new PelicanError({
                message: `Failed to fetch /${path}: ${response.statusText} (${response.status})`,
                response,
            });
        }

        return response;
    }

    /**
     * Post to a signed URL.
     */
    public async postSignedURL({ url, form }: PostSignedURLOptions): Promise<Response> {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.client.token}`,
                Accept: "application/json",
                Origin: this.client.url,
            },
            body: form,
        });

        if (!response.ok) {
            throw new PelicanError({
                message: `Failed to fetch ${url}: ${response.statusText} (${response.status})`,
                response,
            });
        }

        return response;
    }

    /**
     * Send a GET request and return the json response.
     */
    public async get(path: string): Promise<unknown> {
        const response = await this.request({ path });
        const data: unknown = await response.json();
        return data;
    }

    /**
     * Send a POST request and return the json response.
     */
    public async post(path: string, body?: string | object): Promise<unknown> {
        const response = await this.request({ method: "POST", path, body });
        const data: unknown = await response.json();
        return data;
    }

    /**
     * Send a PATCH request and return the json response.
     */
    public async patch(path: string, body?: string | object): Promise<unknown> {
        const response = await this.request({ method: "PATCH", path, body });
        const data: unknown = await response.json();
        return data;
    }

    /**
     * Send a GET request and return the raw response.
     */
    public async rawGet(path: string): Promise<Response> {
        const response = await this.request({ path });
        return response;
    }

    /**
     * Send a POST request and return the raw response.
     */
    public async rawPost(path: string, body?: string | object): Promise<Response> {
        const response = await this.request({ method: "POST", path, body });
        return response;
    }

    /**
     * Send a PATCH request and return the raw response.
     */
    public async rawPatch(path: string, body?: string | object): Promise<Response> {
        const response = await this.request({ method: "PATCH", path, body });
        return response;
    }

    /**
     * Send a DELETE request and return the raw response.
     */
    public async rawDelete(path: string): Promise<Response> {
        const response = await this.request({ method: "DELETE", path });
        return response;
    }
}
