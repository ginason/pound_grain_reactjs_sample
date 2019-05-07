
## Features

- Sellev REST API Server

## Docs & Community

- [REST API Docs](http://docs.sellev.com)
- [pm2 init.d](http://pm2.keymetrics.io/docs/usage/startup/#verify-startup-apps)

## Test Start

- [testframeowork](https://mochajs.org/)

```bash
$ npm test
```

## Quick Start

MySQL should be running, before start server.

Install dependencies:

```bash
$ npm install
```

Start the server:

```bash
#using pm2
$ sudo npm install pm2 -g
$ cd {SERVER-ROOT}/src/env/
$ pm2 start startup-{environment}.json
$ pm2 restart all
#pm2 list
#pm2 logs

#using npm, ( for developent )
$ npm start
```