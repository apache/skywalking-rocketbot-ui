Rocketbot
===============

The UI for [Apache SkyWalking](https://github.com/apache/incubator-skywalking).

## Development

The app was built with [vue typescript](https://github.com/vuejs/vue).

### Getting codes

Fork, then clone the `incubator-skywalking-ui` repo and change directory into it.

```
git clone https://github.com/apache/incubator-skywalking-ui.git
cd incubator-skywalking-ui
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

