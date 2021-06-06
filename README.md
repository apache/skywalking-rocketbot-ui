Apache SkyWalking Rocketbot UI
===============

<img src="http://skywalking.apache.org/assets/logo.svg" alt="Sky Walking logo" height="90px" align="right" />

[Apache SkyWalking](https://github.com/apache/incubator-skywalking) UI.

![NPM BUILD](https://github.com/apache/skywalking-rocketbot-ui/workflows/Node%20CI/badge.svg)

# Contact Us
* Submit an [issue](https://github.com/apache/skywalking/issues)
* Mailing list: **dev@skywalking.apache.org**. Mail to `dev-subscribe@skywalking.apache.org`, follow the reply to subscribe the mailing list
* Join `skywalking` channel at [Apache Slack](http://s.apache.org/slack-invite)
* QQ Group: 392443393, 901167865

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
