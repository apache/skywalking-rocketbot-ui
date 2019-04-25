Apache SkyWalking Rocketbot UI
===============

<img src="http://skywalking.apache.org/assets/logo.svg" alt="Sky Walking logo" height="90px" align="right" />

The UI for [Apache SkyWalking](https://github.com/apache/incubator-skywalking).

[![Build Status](https://travis-ci.org/apache/skywalking-rocketbot-ui.svg?branch=master)](https://travis-ci.org/apache/skywalking-rocketbot-ui)


## Development

 The app was built with [vue + typescript](https://github.com/vuejs/vue).

### Prepare

Fork, then clone the repo and change directory into it.
Install dependencies via `npm`:

```
npm install
```

### Build

**Notice, as SkyWalking primary UI, the npm build has been integration in SkyWalking dist build.** 

**All following builds are for dev.**

### Dev Build
```
npm install
npm run serve
```

### Docker Build
```
npm install
npm run serve
docker build -t skywalking-rocketbot .
```

### Running the docker image

```
docker run -p 8080:80 -d -e SKYWALKING_URL=127.0.0.1:1234,127.0.0.1:1235 skywalking-rocketbot
```

`SKYWALKING_URL` is the address of your OAP backend, multiple IP is changed by comma.


The default UI address is `http://localhost:8080`. Default username/password is `admin/admin`.

## Contributing to SkyWalking RocketBot

Thanks for your interest and hope it will be a
pleasant experience.

### How to contribute?

Most of the contributions received are code contributions, and documentation, bugs, requirements are also welcomed.

### How to report a bug?

Please report bug to [SkyWalking main repo](https://github.com/apache/skywalking/issues).

## FAQ


1、How to set TimeZone in RocketBot Docker?

e.g: setting `Asia/Shanghai` TimeZone in RocketBot [Dockerfile](Dockerfile) as followings:

```txt
···
ENV TZ Asia/Shanghai
RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone
```
