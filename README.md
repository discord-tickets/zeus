# zeus

1. `bot` was written first, but bun won't connect to the unix socket
2. so `proxy` was written to forward requests to the unix socket from node.js
3. but it doesn't work, so `node-bot` is copied from `bot` with typescript removed and changes to work with node.js

> [!WARNING]
> `bot` is now behind `node-bot`

## Environment Variables

```
CONTAINER_NAME=
DISCORD_TOKEN=
```
> [!WARNING]
> Make sure you restrict the bots slash commands to only your staff roles in the bots settings on your Discord server so only those you know can pull (potentially sensitive) Portainer/Docker logs
