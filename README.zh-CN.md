# think-ioredis

依赖 [ioredis](https://www.npmjs.com/package/ioredis) 开发的Thonkjs框架 session,cache驱动

Features
- 支持session在redis中的prifix.
- 支持redis cluster

## 安装
```
npm install think-ioredis
```

## 使用方法
- 引入adapter
```js
import ioredisAdapter from 'think-ioredis'
think.adapter('socket', 'ioredis', ioredisAdapter.Socket)
think.adapter('cache', 'ioredis', ioredisAdapter.Cache)
think.adapter('session', 'ioredis', ioredisAdapter.Session)
```
- 定义配置文件: common/config/ioredis.js
```js
'use strict'

/**
 * redis configs
 * 一个节点使用redis连接,多个节点采用cluster连接
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

****调用方法和官方的cache,session一致
## LICENSE

MIT
