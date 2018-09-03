import resolve from "resolve";
import assert from "assert";
import registerBabel, { addBabelRegisterFiles } from "./registerBabel";

const debug = require("debug")("umi-build-dev:getPlugin");

/**
 * 获得安装的插件
 * @param {Object} opts
 * @param {} opts.cwd 应用的工作目录
 * @param {} opts.configPlugins 配置文件中的配置的插件
 * @param {} opts.pluginsFromOpts 命令行选项中配置的插件
 * @return {Array} 返回插件集合 {id,apply,opts}
 */
export default function(opts = {}) {
  const { configPlugins = [], pluginsFromOpts = [], cwd } = opts;

  /**
   *
   * @param {String|String[]} plugins 插件列表
   * @returns {Array[]} 返回插件的绝对路径列表
   */
  function pluginToPath(plugins) {
    return plugins.map(p => {
      assert(
        Array.isArray(p) || typeof p === "string",
        `Plugin config should be String or Array, but got ${p}`
      );

      if (typeof p === "string") {
        p = [p];
      }

      const [path, opts] = p;
      try {
        return [
          resolve.sync(path, {
            basedir: cwd
          }),
          opts
        ];
      } catch (e) {
        throw new Error(
          `
Plugin ${path} can't be resolved, please make sure you have installed it.

Try:

  npm install ${path} --save-dev
        `.trim()
        );
      }
    });
  }

  //
  // 1. 合并多重插件来源
  // 2. require.resolve
  //
  const pluginPaths = [
    ...pluginToPath(
      process.env.UMI_PLUGINS ? process.env.UMI_PLUGINS.split(",") : []
    ),
    ...pluginToPath(configPlugins),
    ...pluginToPath(pluginsFromOpts)
  ];

  // 用户给的插件需要做 babel 转换
  if (pluginPaths.length) {
    // 为plugin add babel-register
    addBabelRegisterFiles(pluginPaths.map(p => p[0]));

    // 注册 register babel
    registerBabel({
      cwd
    });
  }

  // 内置插件
  const builtInPlugins = [
    "./plugins/commands/dev",
    "./plugins/commands/build",
    "./plugins/commands/test",
    "./plugins/output-path",
    "./plugins/global-js",
    "./plugins/global-css",
    "./plugins/mock",
    "./plugins/proxy",
    "./plugins/history",
    "./plugins/afwebpack-config",
    "./plugins/404" // 404 must after mock
  ];

  // require 模块
  const plugins = [
    // builtIn 的在最前面
    ...builtInPlugins.map(p => {
      const apply = require(p); // eslint-disable-line
      let opts;

      if (Array.isArray(p)) {
        opts = p[1]; // eslint-disable-line
        p = [0];
      }

      return {
        id: p.replace(/^.\//, "built-in:"),
        apply: apply.default || apply,
        opts
      };
    }),

    ...pluginPaths.map(p => {
      const [path, opts] = p;
      const apply = require(path); // eslint-disable-line
      return {
        id: path.replace(cwd, "user:"),
        apply: apply.default || apply,
        opts
      };
    })
  ];

  debug(`plugins: ${plugins.map(p => p.id)}`);

  return plugins;
}
