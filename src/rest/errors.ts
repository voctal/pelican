/**
 * Represents an API error.
 */
export class PelicanError extends Error {
    /**
     * The raw response.
     */
    public readonly response: Response;
    /**
     * The response status.
     */
    public readonly status: number;

    public constructor(options: { message?: string; response: Response }) {
        super(options.message);
        this.response = options.response;
        this.status = options.response.status;
    }
}
