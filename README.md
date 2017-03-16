# think-ioredis

Use [ioredis](https://www.npmjs.com/package/ioredis) for thinkjs session,cache
Wo had test using for session and cache

Features
- defined prefix for session.

## Install

```
npm install think-ioredis
```

## How to use
- import Adapter
```js
import ioredisAdapter from 'think-ioredis'
think.adapter('socket', 'ioredis', ioredisAdapter.Socket)
think.adapter('cache', 'ioredis', ioredisAdapter.Cache)
think.adapter('session', 'ioredis', ioredisAdapter.Session)
```
- defined config: common/config/ioredis.js
```js
'use strict'

/**
 * redis configs
 * more  than one nodes,wo will connection with Redis Cluster
 */
export default {
  nodes: [
    {
      host: 'localhost',
      port: 6379
    },
  // {
  //   host: '10.21.10.101',
  //   port: 6370
  // }
  ],
  password: ''
  // ... other config
}

```

- Cache config
```js
  type: 'ioredis', // config ioredis type
  timeout: 3600, 
  adapter: { 
    ioredis: {
      prefix: 'mydmpweb:cache:'
    }
  }
```

- Session config
```js
'use strict'

/**
 * session configs
 */
export default {
  name: 'thinkjs_',
  type: 'ioredis',
  secret: '6T3fdfert34&3e3dedtrre#',
  timeout: 3600,
  cookie: { // cookie options
    length: 32,
    httponly: true
  },
  adapter: {
    ioredis: {
      prefix: 'mydmpweb:session:'
    }
  }
}
```

****
Usage is the same as official adapter

## LICENSE

MIT