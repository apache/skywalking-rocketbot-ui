Rocketbot
===============

The UI for [Apache SkyWalking](https://github.com/apache/incubator-skywalking).

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
