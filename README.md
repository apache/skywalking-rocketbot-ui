<p align="center"><img src="https://user-images.githubusercontent.com/19775780/53944427-4f6c2580-40fa-11e9-95f3-2b4ce1f2f8f3.png"  width="250"></p>
<h1 align="center"></h1>

<p align="center">
<a><img src="https://img.shields.io/badge/version-1.1.0-blue.svg?longCache=true&style=popout-square"></a>
<a href="https://www.apache.org/licenses/LICENSE-2.0"><img src="https://img.shields.io/badge/license-Apache2.0-brightgreen.svg?longCache=true&style=popout-square"></a>
</p>

## Introduction
**RocketBot**: A modern and awesome UI for [Apache SkyWalking](https://github.com/apache/incubator-skywalking).

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

## Live Demo
**[Demo](http://106.75.237.45/)**

| Username        | Password           |
| ------------- |:-------------:|
| admin     | admin |

## Development

 The app was built with [vue + typescript](https://github.com/vuejs/vue).

### Prepare

Fork, then clone the `rocketbot` repo and change directory into it.

```
git clone https://github.com/TinyAllen/rocketbot.git
cd rocketbot
```

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
docker build -t rocketbot .
```
### Running the docker image

```
docker run -p 8080:80 -d -e SKYWALKING_URL=127.0.0.1:1234,127.0.0.1:1235 rocketbot
```

`SKYWALKING_URL` is the address of your backend, multiple IP is changed by comma.


The default UI address is `http://localhost:8080`.

## Contributing to RocketBot

Thanks for your interest and hope it will be a
pleasant experience.

### How to contribute?

Most of the contributions received are code contributions, and documentation, bugs, requirements are also welcomed.

### How to report a bug?

* **Ensure the bug was not already reported** by searching on GitHub under [Issues]().

* If you're unable to find an open issue addressing the problem, [open a new one](). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample** or an **executable test case** demonstrating the expected behavior that is not occurring.

## Who Uses SkyWalking Rocketbot?
Which companies are using SkyWalking RocketBot, Welcome to register in issues #15 !（This is for open source users reference only.）
<p>

<img src="https://daoweb-resource.daocloud.io/logo/daocloud-logo-gray-account.svg" height="40px">&nbsp;&nbsp;
<img src="https://user-images.githubusercontent.com/19775780/47834441-7c21d080-ddda-11e8-9e3a-67c43ab074bf.png" height="40px"  >&nbsp;&nbsp;
<img src="https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=4229681157,1554083661&fm=58&s=51B3A8720790BF80CCC2538703007088&bpow=121&bpoh=75" height="40px">&nbsp;&nbsp;

</p>

## FAQ


1、How to set TimeZone in RocketBot Docker?

e.g: setting `Asia/Shanghai` TimeZone in RocketBot [Dockerfile](Dockerfile) as followings:

```txt
···
ENV TZ Asia/Shanghai
RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone
```