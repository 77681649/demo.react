| 属性 | 类型 | 说明 |
| ----| ----- | ---- |
| cwd | String | Application 工作目录 |
| pkg | Object | Application package.json 内容 |
| config | Object | 用户配置 ( .umirc.js / config/config.js 配置文件中的内容 ) |
| userConfig | Object | 用户配置(非缓存) |
| webpackConfig |  | webpack配置 |
| paths | Object | 路径集合 |
| routes |  | 路由集合 |
| plugins | Plugin[] | 存储注册的插件 |
| extraPlugins | Plugin[] | 通过 api.registerPlugin 注册的插件 |
| pluginMethods | Map<name, function>  | 存储注册的Plugin API |
| pluginHooks | | 存储注册的Plugin Hook |
| commands | Map<name, {fn, opts}> | 存储注册的执行命令 |
| generators | | |
