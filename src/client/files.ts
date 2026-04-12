import { Controller } from "../controller";
import { FileObject, fileObjectListSchema, fileObjectSchema } from "../objects/file-object";
import { GenericList } from "../objects/list";
import { SignedURL, signedURLSchema } from "../objects/signed-url";
import { PelicanError } from "../rest/errors";
import { query } from "../rest/query";

/**
 * The request options to compress files.
 */
export interface CompressFilesOptions {
    /**
     * Root directory of the compression.
     */
    root?: string;
    /**
     * Name of the compressed file (without the extension)
     */
    name?: string;
    /**
     * The compressed file extension.
     * Allowed values: zip tgz tar.gz txz tar.xz tbz2 tar.bz2
     */
    extension?: string;
    /**
     * Files/directories to compress.
     */
    files: string[];
}

/**
 * The request options to decompress files.
 */
export interface DecompressFilesOptions {
    /**
     * Directory containing the archive (e.g. `/`)
     */
    root?: string;
    /**
     * Archive filename.
     */
    file: string;
}

/**
 * The request options to delete files.
 */
export interface DeleteFilesOptions {
    /**
     * Parent directory path (e.g. `/`)
     */
    root: string;
    /**
     * Array of filenames/directories to delete
     */
    files: string[];
}

/**
 * The request options to create a directory.
 */
export interface CreateDirectoryOptions {
    /**
     * Parent directory path (e.g. `/`)
     */
    root?: string;
    /**
     * 	Name of the new folder
     */
    name: string;
}

/**
 * The files controller.
 *
 * - Type: Client
 *
 * - Path: `/api/client/servers/{server}/files`
 */
export class Files extends Controller {
    /**
     * Returns a listing of files in a given directory.
     * Do not encode `directory`, as it will already call `encodeURIComponent` on it.
     *
     * Route: `GET /api/client/servers/{server}/files/list`
     *
     * @param serverId - Server short ID
     * @param directory - Directory path to list (default: `/`)
     */
    public async list(serverId: string, directory?: string): Promise<GenericList<FileObject>> {
        const params = query({ directory: directory && encodeURIComponent(directory) });
        const json = await this.client.rest.get(`client/servers/${serverId}/files/list${params}`);

        return fileObjectListSchema.parse(json);
    }

    /**
     * Return the contents of a specified file for the user.
     * Do not encode `file`, as it will already call `encodeURIComponent` on it.
     *
     * Route: `GET /api/client/servers/{server}/files/contents`
     *
     * @param serverId - Server short ID
     * @param file - Path to the file to read
     */
    public async read(serverId: string, file: string): Promise<string> {
        const params = query({ file: encodeURIComponent(file) });
        const response = await this.client.rest.rawGet(`client/servers/${serverId}/files/contents${params}`);

        return await response.text();
    }

    /**
     * Generates a one-time token with a link to download a given file.
     * Do not encode `file`, as it will already call `encodeURIComponent` on it.
     *
     * Route: `GET /api/client/servers/{server}/files/download`
     *
     * @param serverId - Server short ID
     * @param file - Path to the file to download
     */
    public async downloadFile(serverId: string, file: string): Promise<SignedURL> {
        const params = query({ file: encodeURIComponent(file) });
        const json = await this.client.rest.get(`client/servers/${serverId}/files/download${params}`);

        return signedURLSchema.parse(json);
    }

    /**
     * Writes the contents of the specified file to the server.
     * Do not encode `file`, as it will already call `encodeURIComponent` on it.
     *
     * Route: `POST /api/client/servers/{server}/files/write`
     *
     * @param serverId - Server short ID
     * @param file - Path to the file to write
     * @param content - The file content as plain text
     */
    public async write(serverId: string, file: string, content: string) {
        const params = query({ file: encodeURIComponent(file) });
        const response = await this.client.rest.rawPost(`client/servers/${serverId}/files/write${params}`, content);

        if (response.status !== 204) {
            throw new PelicanError({
                message: "Failed to write a file, the API did not return a 204",
                response: response,
            });
        }
    }

    /**
     * Create an archive (ZIP/TAR/...) from files and directories.
     *
     * Route: `POST /api/client/servers/{server}/files/compress`
     *
     * @param serverId - Server short ID
     */
    public async compress(serverId: string, options: CompressFilesOptions): Promise<FileObject> {
        const json = await this.client.rest.post(`client/servers/${serverId}/files/compress`, options);
        return fileObjectSchema.parse(json);
    }

    /**
     * Extract files from an archive.
     *
     * Route: `POST /api/client/servers/{server}/files/decompress`
     *
     * @param serverId - Server short ID
     *
     */
    public async decompress(serverId: string, options: DecompressFilesOptions) {
        const response = await this.client.rest.rawPost(`client/servers/${serverId}/files/decompress`, options);

        if (response.status !== 204) {
            throw new PelicanError({
                message: "Failed to decompress a file, the API did not return a 204",
                response: response,
            });
        }
    }

    /**
     * Deletes files or folders for the server in the given root directory.
     *
     * Route: `POST /api/client/servers/{server}/files/delete`
     *
     * @param serverId - Server short ID
     */
    public async delete(serverId: string, options: DeleteFilesOptions) {
        const response = await this.client.rest.rawPost(`client/servers/${serverId}/files/delete`, options);

        if (response.status !== 204) {
            throw new PelicanError({
                message: "Failed to delete files, the API did not return a 204",
                response: response,
            });
        }
    }

    /**
     * Creates a new folder on the server.
     *
     * Route: `POST /api/client/servers/{server}/files/create-folder`
     *
     * @param serverId - Server short ID
     */
    public async createDirectory(serverId: string, options: CreateDirectoryOptions) {
        const response = await this.client.rest.rawPost(`client/servers/${serverId}/files/create-folder`, options);

        if (response.status !== 204) {
            throw new PelicanError({
                message: "Failed to create directory, the API did not return a 204",
                response: response,
            });
        }
    }

    /**
     * Returns a signed url where files can be uploaded to.
     * Use the `upload` method to upload using the signed URL.
     *
     * Do not encode `directory`, as it will already call `encodeURIComponent` on it.
     *
     * Note: The signed URL is only valid for 15 minutes.
     *
     * Route: `/api/client/servers/{server}/files/upload`
     *
     * @param serverId - Server short ID
     * @param directory - Target directory for upload (default: `/`)
     */
    public async getUploadURL(serverId: string, directory?: string): Promise<SignedURL> {
        const params = query({ directory: directory && encodeURIComponent(directory) });
        const json = await this.client.rest.get(`client/servers/${serverId}/files/upload${params}`);

        return signedURLSchema.parse(json);
    }

    /**
     * Upload files using a signed URL obtained with `getUploadURL`.
     * You will need to create a `FormData` with the file to upload (use `files` as field name).
     *
     * Do not encode `directory`, as it will already call `encodeURIComponent` on it.
     *
     * ## Notes
     *
     * - Uploaded files are created with 0644 permissions (read/write for owner, read-only for others)
     *
     * - Maximum file size: `100 MB per file`
     *
     * - Max files per request: `10`
     *
     * - Allowed file types: `All types (configurable by admin)`
     *
     * @example
     * Example to upload a zip file:
     *
     * ```ts
     * import { readFile } from "node:fs/promises";
     *
     * const buffer = await readFile("path/to/file.zip");
     * const blob = new File([buffer], "remote-file-name.zip", { type: "application/zip" });
     *
     * const form = new FormData();
     * form.append("files", blob); // Must be "files"
     *
     * // Call upload() with the form
     * ```
     *
     * @param form - Use the native `FormData` from Node
     * @param directory - Must match the one used in `getUploadURL`
     */
    public async upload(signedURL: string, form: FormData, directory?: string) {
        const params = query({ directory: directory && encodeURIComponent(directory) });
        await this.client.rest.postSignedURL({ url: `${signedURL}${params}`, form });
    }
}
