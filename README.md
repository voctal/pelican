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

`@voctal/pelican` allows you to easily use the [Pelican Panel](https://pelican.dev) API. See the [module documentation](https://docs.voctal.dev/docs/packages/pelican/stable).

You can find the Pelican API docs on your own panel at `https://<domain>/docs/api`, or on the demo: https://demo.pelican.dev/docs/api.

> [!NOTE]
> This module is still under development and does not include every features. Not everything was fully tested. However you can use the `rest` property of `PelicanApplication` and `PelicanClient` to access the API routes that this module does not support.

## Features

- Client API
- Application API
- WebSocket API
- All responses are validated using Zod
- (almost) Fully typed and documented

## Installation

Node.js 22 or newer is required.

```sh
npm install @voctal/pelican
```

## Example usage

Use `PelicanApplication` to interact with the Application API:

```js
import { PelicanApplication } from "@voctal/pelican";

const application = new PelicanApplication({
    token: "...",
    url: "https://example.com",
});

const servers = await application.servers.list();
const users = await application.users.list();
// See all methods on the documentation
```

Use `PelicanClient` to interact with the Client API:

```js
import { PelicanClient } from "@voctal/pelican";

const client = new PelicanClient({
    token: "...",
    url: "https://example.com",
});

const account = await client.account.get();
const servers = await client.servers.list();
const files = await client.files.list(serverId);
// See all methods on the documentation
```

Use `PelicanWebSocket` to interact with the WebSocket API:

```js
import { PelicanClient, PelicanWebSocket, WebSocketEvents } from "@voctal/pelican";

const client = new PelicanClient({
    token: "...",
    url: "https://example.com",
});

// Get a server identifier
const servers = await client.servers.list();
const firstServerId = servers.data[0]?.attributes.identifier;
if (!firstServerId) return console.log("No servers!");

// Create the WebSocket
const ws = new PelicanWebSocket(client);
const token = await ws.getToken(firstServerId);

ws.on(WebSocketEvents.ConsoleOutput, log => {
    console.log("New server log: ", log);
});

const socket = await ws.connect(token.data);
// `socket` is a native WebSocket instance that you can use if necessary.
```

If you are using the `REST` class, you might need the Zod schemas to validate the responses. They are all available from `@voctal/pelican/schemas`:

```js
import { userSchema } from "@voctal/pelican/schemas";

userSchema.parse(data);
```

## Links

- [Module documentation](https://docs.voctal.dev/docs/packages/pelican/stable)
- [Discord server](https://voctal.dev/discord)
- [GitHub](https://github.com/voctal/pelican)
- [npm](https://npmjs.com/package/@voctal/pelican)
- [Voctal](https://voctal.dev)

## Help

Need help with the module? Ask on our [support server!](https://voctal.dev/discord)
