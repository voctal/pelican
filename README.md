<div align="center">
    <img src="./.github/images/pelican.svg" width="128" alt="Pelican Logo">
    <h1>@voctal/pelican</h1>
    <p>
        <a href="https://voctal.dev/discord"><img src="https://img.shields.io/discord/1336303640725553213?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
        <a href="https://www.npmjs.com/package/@voctal/pelican"><img src="https://img.shields.io/npm/v/@voctal/pelican.svg?maxAge=3600" alt="npm version" /></a>
        <a href="https://www.npmjs.com/package/@voctal/pelican"><img src="https://img.shields.io/npm/dt/@voctal/pelican.svg?maxAge=3600" alt="npm downloads" /></a>
        <a href="https://github.com/voctal/pelican/commits/main"><img alt="Last commit" src="https://img.shields.io/github/last-commit/voctal/pelican?logo=github&logoColor=ffffff" /></a>
    </p>
</div>

## About

`@voctal/pelican` allows you to easily use the [Pelican](https://pelican.dev) panel API. See the [module documentation](https://docs.voctal.dev/docs/packages/pelican/stable).

You can find the Pelican API docs on your own panel at `https://<domain>/docs/api`, or on the demo: https://demo.pelican.dev/docs/api.

> [!NOTE]
> This module is still under development and does not include every features. Not everything was fully tested. However you can use the `rest` property of `PelicanApplication` and `PelicanClient` to access the API routes that this module has not yet implemented.

This module is tested on [Orion Hosting](https://orionhost.xyz).

## Features

- Client API
- Application API
- WebSocket API
- Wings API
- All responses are validated using Zod
- (almost) Fully typed and documented

## Installation

Node.js 22 or newer is required.

```sh
npm install @voctal/pelican
```

## Example usage

### Application API

Use `PelicanApplication` to interact with the Application API:

```js
import { PelicanApplication } from "@voctal/pelican";

const application = new PelicanApplication({
    token: "application api key here",
    url: "https://panel.example.com",
});

// examples:
const servers = await application.servers.list(); // list servers
const users = await application.users.list(); // list users
const nodes = await application.nodes.list(); // list nodes
await application.servers.suspend(1); // suspend a server

// See all methods on the documentation of PelicanApplication
// https://docs.voctal.dev/docs/packages/pelican/stable/PelicanApplication:Class
```

### Client API

Use `PelicanClient` to interact with the Client API:

```js
import { PelicanClient } from "@voctal/pelican";

const client = new PelicanClient({
    token: "client api key here",
    url: "https://panel.example.com",
});

// examples:
const account = await client.account.get(); // get account details
const servers = await client.servers.list(); // list servers
const files = await client.files.list("yourServerId"); // list the server files
await client.servers.sendPowerAction("yourServerId", { signal: "restart" }); // restart a server

// See all methods on the documentation of PelicanClient
// https://docs.voctal.dev/docs/packages/pelican/stable/PelicanClient:Class
```

### WebSocket API

Use `PelicanWebSocket` to interact with the WebSocket API:

```js
import { PelicanClient, PelicanWebSocket, WebSocketEvents } from "@voctal/pelican";

const client = new PelicanClient({
    token: "client api key here",
    url: "https://panel.example.com",
});

// Get a server identifier
const servers = await client.servers.list();
const firstServerId = servers.data[0]?.attributes.identifier;
if (!firstServerId) return console.log("You have no servers!");

// Create the WebSocket
const ws = new PelicanWebSocket(client, firstServerId);

ws.on(WebSocketEvents.ConsoleOutput, log => {
    console.log("New server log: ", log);
});

ws.on(WebSocketEvents.Stats, stats => {
    console.log("New stats: ", stats);
});

await ws.connect();

// See all methods on the documentation of PelicanWebSocket
// https://docs.voctal.dev/docs/packages/pelican/stable/PelicanWebSocket:Class
```

### Wings API

Use `PelicanWing` to interact with the Wings API:

```js
import { PelicanWing } from "@voctal/pelican";

const wing = new PelicanWing({
    token: "wing token from the node config file",
    url: "https://node.example.com:8080",
});

const system = await wing.system.get();
const utilization = await wing.system.getUtilization();
const servers = await wing.servers.list();
const logs = await wing.servers.getLogs("yourServerUUID");

// See all methods on the documentation of PelicanWing
// https://docs.voctal.dev/docs/packages/pelican/stable/PelicanWing:Class
```

## Validation

Since the module does not implement everything, you may need to use the `REST` class:

```js
const application = new PelicanApplication({
    /* ... */
});

const json = await application.rest.get("application/servers");
// "json" is typed as "unknown"
```

In that case, you may need the [Zod](https://zod.dev) schemas to validate the responses. They are all available from `@voctal/pelican/schemas`:

```js
import { userSchema } from "@voctal/pelican/schemas";

userSchema.parse(data);

// See all exported schemas in https://github.com/voctal/pelican/blob/main/src/schemas.ts
```

## Links

- [Module documentation](https://docs.voctal.dev/docs/packages/pelican/stable)
- [Discord server](https://voctal.dev/discord)
- [GitHub](https://github.com/voctal/pelican)
- [npm](https://npmjs.com/package/@voctal/pelican)
- [Voctal](https://voctal.dev)

## Help

Need help with the module? Ask on our [support server!](https://voctal.dev/discord)
