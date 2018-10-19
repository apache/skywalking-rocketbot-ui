Rocketbot
===============

The UI for [Apache SkyWalking](https://github.com/apache/incubator-skywalking).

<img src="https://daoweb-resource.daocloud.io/logo/daocloud-logo-gray-account.svg" alt="Sample"  width="150" height="50">

Supported By [DaoCloud Labs](https://github.com/DaoCloud-Labs)

[Demo](http://rocketbot.daocloud.io/)

## Development

The app was built with [vue typescript](https://github.com/vuejs/vue).

### Getting codes

Fork, then clone the `rocketbot` repo and change directory into it.

```
git clone https://github.com/TinyAllen/rocketbot.git
cd rocketbot
```

Install dependencies via `npm`:

```
npm install
```

### Running the application


The default collector query address is `http://localhost:8080`.

#### Commands

| Command                 | Description                                                 |
| ----------------------- | ----------------------------------------------------------- |
| `npm start`             | Starts development server with hot reloading.      |
| `npm run host` | Starts development servers other can link             |
| `npm run lint`          | Lint the project (tslint)                        |
| `npm run build`         | Runs production build. Outputs files to `/dist`.            |

## Build

Running build will output all the static files to the `./dist` folder:

```
npm install
npm run build
```

[ci-img]: https://travis-ci.org/apache/incubator-skywalking-ui.svg?branch=master
[ci]: https://travis-ci.org/apache/incubator-skywalking-ui
[gitter-img]: https://badges.gitter.im/openskywalking/Lobby.svg
[gitter]: https://gitter.im/openskywalking/Lobby

## Docker Image Build


```
npm install

npm run build

docker build -t rocketbot .
```
### Running the docker image

```
docker run -p 8080:80 -d -e SKYWALKING_URL=http://localhost:12800 rocketbot
```

`SKYWALKING_URL` is the address of your backend.


The default frontend address is `http://localhost:8080`.

## Nginx config

### Reserve proxy

```
  location /api {
    rewrite ^/(.*) /graphql break;
    proxy_pass SKYWALKING_URL;
  }
```

**Important**: If you want to deploy the application by yourself，**you need to rewirte the URL path into ```/graphql``` before reserve proxy**.

# Contributing to RocketBot

Firstly, thanks for your interest in contributing! I hope that this will be a
pleasant first experience for you, and that you will return to continue
contributing.

## How to contribute?

Most of the contributions that we receive are code contributions, but you can
also contribute to the documentation or simply report solid bugs
for us to fix.

## How to report a bug?

* **Ensure the bug was not already reported** by searching on GitHub under [Issues](https://github.com/TinyAllen/rocketbot/issues).

* If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/TinyAllen/rocketbot/issues/new). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample** or an **executable test case** demonstrating the expected behavior that is not occurring.
