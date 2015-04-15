dataHub
========

数据处理中心, 数据中转，处理数据并提供api接口供访问。

基于EventEmitter实现插件形式扩展，及插件间接口通信。

### Develop
```
npm install
cd sys_modules/ping
npm link

cd ../..
npm link datahub-plugin-ping


npm test

npm start
```

