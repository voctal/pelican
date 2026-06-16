export { allocationSchema, allocationListSchema, allocationGenericListSchema } from "./objects/allocation";
export { apiKeySchema, apiKeyListSchema, createdApiKeySchema } from "./objects/api-key";
export { clientServerSchema, clientServerListSchema } from "./objects/client-server";
export { clientUserSchema } from "./objects/client-user";
export { eggVariableSchema, eggVariableListSchema, eggVariableGenericListSchema } from "./objects/egg-variable";
export { eggSchema, eggListSchema, eggGenericListSchema } from "./objects/egg";
export {
    fileObjectSchema,
    fileObjectListSchema,
    invalidFileObjectListSchema,
    invalidFileObjectSchema,
} from "./objects/file-object";
export { genericObjectSchema } from "./objects/generic";
export { createGenericListSchema, createListSchema } from "./objects/list";
export { mountSchema, mountListSchema, mountGenericListSchema } from "./objects/mount";
export {
    nodeConfigurationSchema,
    nodeConfigurationAPISchema,
    nodeConfigurationSystemSchema,
} from "./objects/node-configuration";
export { nodeSchema, nodeListSchema, nodeGenericListSchema } from "./objects/node";
export { serverSchema, serverListSchema, serverGenericListSchema } from "./objects/server";
export { signedURLSchema } from "./objects/signed-url";
export { resourceStatsSchema } from "./objects/stats";
export { userSchema, userListSchema, createdUserSchema } from "./objects/user";
export { webSocketTokenSchema } from "./objects/websocket-token";
export { webSocketMessageSchema, webSocketStatsEventDataSchema } from "./objects/websocket";

export {
    wingServerConfigurationSchema,
    wingServerLogsSchema,
    wingServerSchema,
    wingServerUtilizationSchema,
    wingServerInstallLogsSchema,
} from "./wings/servers-objects";
export {
    wingSystemDockerDiskSchema,
    wingSystemIPsSchema,
    wingSystemSchema,
    wingSystemUtilizationDiskDetailsSchema,
    wingSystemUtilizationSchema,
} from "./wings/system-objects";
