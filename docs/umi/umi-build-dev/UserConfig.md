| service | String | Application 工作目录 |
configFailed = false;
this.config = null;
this.file = null;
this.relativeFile = null;
this.watch = watch;
this.unwatch = unwatch;
| file | String | 配置文件 |
| relativeFile | String | 配置文件的相对路径 |
| plugins | Object[] | 插件列表 - 负责验证和处理变化 |
