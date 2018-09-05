umi dev register-babel
负责解析

- 配置文件
- 插件文件

babelrc = false
cache = false

- babel-preset-umi
  - presets
    - @babel/preset-env
    - @babel/preset-react
  - plugins
    - babel-plugin-react-require
    - @babel/plugin-syntax-dynamic-import
    - @babel/plugin-proposal-object-rest-spread
    - @babel/plugin-proposal-optional-catch-binding
    - @babel/plugin-proposal-async-generator-functions
    - @babel/plugin-proposal-decorators
    - @babel/plugin-proposal-class-properties
    - @babel/plugin-proposal-export-namespace
    - @babel/plugin-proposal-export-default
    - @babel/plugin-proposal-export-namespace-from
    - @babel/plugin-proposal-export-default-from
    - @babel/plugin-proposal-nullish-coalescing-operator
    - @babel/plugin-proposal-optional-chaining
    - @babel/plugin-proposal-pipeline-operator
    - @babel/plugin-proposal-do-expressions
    - @babel/plugin-proposal-function-bind
- babel-plugin-add-module-exports
- @babel/plugin-transform-modules-commonjs
