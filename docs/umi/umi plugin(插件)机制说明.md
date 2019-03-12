
#### 插件的格式

```javascript

export default function apply(pluginAPI: PluginAPI, options: Object){
    // pluginAPI: plugin API
    // options: 选项
    // options.memo plugin 计算结果
    // options.args plugin 参数
}

```



### Plugin 执行过程
#### 概述

1. resolve: 解析插件 && 加载插件
2. init: 初始化插件
3. apply: 执行插件

#### resolve

1. 解析插件路径
2. 加载插件路径对应的模块

#### init

1. 

#### apply

| 生命周期 | | 说明 |
| --- | --- | --- |
| resolve | 解析插件 | 解析插件文件, 获得插件的apply函数 |
| init | 初始化插件 | 插件绑定Plugin API, 调用apply函数 |
| apply | 执行插件 | 执行插件逻辑 - 调用相关的API, 注册适当内容 -- hook, method. command, generator |



### Plugin 
#### Plugin 属性说明

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| id | String | 插件的ID |
| apply | Function | 插件的 apply 方法 |
| opts | Object | 插件的选项 |
| \_api | PluginAPI | 插件绑定的 Plugin API
| onOptionChange | | |


| fn | Function |  |
| opts | Object |  |