Apache SkyWalking Rocketbot UI
===============

<img src="http://skywalking.apache.org/assets/logo.svg" alt="Sky Walking logo" height="90px" align="right" />

The UI for [Apache SkyWalking](https://github.com/apache/incubator-skywalking).

[![Build Status](https://travis-ci.org/apache/skywalking-rocketbot-ui.svg?branch=master)](https://travis-ci.org/apache/skywalking-rocketbot-ui)

## Screenshots
**Dashboard**

![](https://user-images.githubusercontent.com/19775780/53947142-22bb0c80-4100-11e9-82b5-6efe6d38bc0a.png)

![](https://user-images.githubusercontent.com/19775780/53947161-28185700-4100-11e9-96ef-a4852d6b60ad.png)

**Topology**

![](https://user-images.githubusercontent.com/19775780/53947172-2babde00-4100-11e9-8213-d6d4f5992de4.png)
**Trace**

![](https://user-images.githubusercontent.com/19775780/53947182-2e0e3800-4100-11e9-96e7-1c7eed437ed2.png)

**Alarm**

![](https://user-images.githubusercontent.com/19775780/53947184-2fd7fb80-4100-11e9-90b8-205c307a6a55.png)


## Development

 The app was built with [vue + typescript](https://github.com/vuejs/vue).

### Prepare

Fork, then clone the repo and change directory into it.
Install dependencies via `npm`:

```
npm install
```

### Run

The default collector query endpoint is `http://localhost:8080`.

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

## Docker Build

**Note: Those dockerfile is just for developer review or refer methods.**

```
npm install
npm run build
docker build -t skywalking-rocketbot .
```
### Running the docker image

```
docker run -p 8080:80 -d -e SKYWALKING_URL=127.0.0.1:1234,127.0.0.1:1235 skywalking-rocketbot
```

`SKYWALKING_URL` is the address of your backend, multiple IP is changed by comma.


The default UI address is `http://localhost:8080`.

## Contributing to SkyWalking RocketBot

Thanks for your interest and hope it will be a
pleasant experience.

### How to contribute?

Most of the contributions received are code contributions, and documentation, bugs, requirements are also welcomed.

### How to report a bug?

* **Ensure the bug was not already reported** by searching on GitHub under [Issues]().

* If you're unable to find an open issue addressing the problem, [open a new one](). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample** or an **executable test case** demonstrating the expected behavior that is not occurring.

## FAQ


1、How to set TimeZone in RocketBot Docker?

e.g: setting `Asia/Shanghai` TimeZone in RocketBot [Dockerfile](Dockerfile) as followings:

```txt
···
ENV TZ Asia/Shanghai
RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone
```
