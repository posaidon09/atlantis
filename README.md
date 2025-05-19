# Atlantis
A work-in-progress self-hosted anime streaming service without clutter!

## How it works
It uses the [Consumet](https://github.com/consumet/api.consumet.org) api to fetch the needed info about the anime you're looking for and [Shinra proxy](https://github.com/xciphertv/shrina-proxy) to stream the episodes

## Installation
Atlantis is available as a docker container!
```bash
docker pull posaidon/atlantis-app
```
## Running
You need to expose the frontend and proxy ports and set the environment variables
```bash
# 3001: website
# 3000: proxy
# You can also deploy your own instance of Consumet api on vercel using https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fconsumet%2Fapi.consumet.org
docker run -d -p 3001:80 -p 3000:3000 \
  -e VITE_BACKEND=https://atlantis-backend.vercel.app \
  -e VITE_PROXY=http://localhost:3000/proxy \
  atlantis-app

```
