Apache SkyWalking Rocketbot UI
===============

<img src="http://skywalking.apache.org/assets/logo.svg" alt="Sky Walking logo" height="90px" align="right" />

[Apache SkyWalking](https://github.com/apache/incubator-skywalking) UI.

[![Build Status](https://travis-ci.org/apache/skywalking-rocketbot-ui.svg?branch=master)](https://travis-ci.org/apache/skywalking-rocketbot-ui)

# Contact Us
* Submit an [issue](https://github.com/apache/skywalking/issues)
* Mail list: **dev@skywalking.apache.org**. Mail to `dev-subscribe@skywalking.apache.org`, follow the reply to subscribe the mail list.
* Join `skywalking` channel at [Apache Slack](https://join.slack.com/t/the-asf/shared_invite/enQtNzc2ODE3MjI1MDk1LTAyZGJmNTg1NWZhNmVmOWZjMjA2MGUyOGY4MjE5ZGUwOTQxY2Q3MDBmNTM5YTllNGU4M2QyMzQ4M2U4ZjQ5YmY). If the link is not working, find the latest one at [Apache INFRA WIKI](https://cwiki.apache.org/confluence/display/INFRA/Slack+Guest+Invites).
* QQ Group: 392443393(2000/2000, not available), 901167865(available)

## Release
This repo wouldn't release separately. All source codes have been included in the main repo release. The tags match the [main repo](https://github.com/apache/skywalking) tags.

## Development

 The app was built with [vue + typescript](https://github.com/vuejs/vue).

### Prepare

1. Fork, then clone the repo and change directory into it.
1. Install dependencies via `npm`:

```
npm install
```

### Build

**Notice, as SkyWalking primary UI, the npm build has been integration in SkyWalking dist build.** 

**All following builds are for dev.**
```
npm install
npm run serve
```

The default UI address is `http://localhost:8080`.

# License
[Apache 2.0 License.](/LICENSE)
