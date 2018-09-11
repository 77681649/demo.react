/**
 *
 */
import chalk from "chalk";
import { join } from "path";
import getPaths from "./getPaths";
import getPlugins from "./getPlugins";
import PluginAPI from "./PluginAPI";
import UserConfig from "./UserConfig";
import registerBabel from "./registerBabel";
import getWebpackConfig from "./getWebpackConfig";

const debug = require("debug")("umi-build-dev:Service");

/**
 * Dev Server
 * 
 * @example 
 * 
 * 属性
 * cwd            String  应用的工作目录 
 * pkg            Object  应用的package.json内容
 * config         Object  应用的用户配置
 * paths          Object  umi 需要的路径集合
 * webpackConfig  Object  webpack 配置
 * plugins        Array   插件集合(内建插件 && 用户插件) 
 *    id: String,
 *    apply: Function 
 *    opts: Object
 * pluginMethods 
 *    fn          Array
 * commands       Array   可运行的命令
 *    fn
 *    opts
 * dev
 */
export default class Service {
  constructor({ cwd, plugins }) {
    // 1. 设置cwd
    this.cwd = cwd || process.cwd();

    // 2. 获得package.json的内容
    try {
      this.pkg = require(join(this.cwd, "package.json"));
    } catch (e) {
      this.pkg = {};
    }

    // 3. 注册babel-register
    registerBabel({
      cwd: this.cwd
    });

    // 4. 初始化
    this.pluginMethods = {};
    this.commands = {};

    // 5. 获得配置文件中的配置
    const config = UserConfig.getConfig({
      cwd: this.cwd,
      service: this
    });

    this.config = config;

    debug(`user config: ${JSON.stringify(config)}`);

    // 4. 解析CLI plugins, 返回配置的插件
    // 插件集合 {id,apply,opts}[]
    this.plugins = this.resolvePlugins({
      config,
      plugins
    });

    debug(`plugins: ${this.plugins.map(p => p.id).join(" | ")}`);

    // resolve paths after resolvePlugins, since it needs this.config
    this.paths = getPaths(this);
  }

  /**
   * 解析 plugins
   * @param {Object} options 选项
   * @param {Object} options.config 用户配置
   * @param {String[]} options.plugins 插件
   * @return {Array} 返回插件集合 {id,apply,opts}
   */
  resolvePlugins({ config, plugins }) {
    try {
      return getPlugins({
        configPlugins: config.plugins || [],
        pluginsFromOpts: plugins,
        cwd: this.cwd
      });
    } catch (e) {
      console.error(chalk.red(e.message));
      console.error(e);
      process.exit(1);
    }
  }

  /**
   * 执行指定的插件方法, 以reduce的方式合并所有插件方法的返回结果
   * @param {String} key 
   * @param {Object} otp 传递个插件方法的参数
   */
  applyPlugins(key, opts = {}) {
    const methods = this.pluginMethods[key] || []

    return methods.reduce((memo, { fn }) => {
      try {
        return fn({
          memo,
          args: opts.args
        });
      } catch (e) {
        console.error(chalk.red(`Plugin apply failed: ${e.message}`));
        throw e;
      }
    }, opts.initialValue);
  }

  init() {
    // load env

    // load user config

    // init plugins
    this.plugins.forEach(({ id, apply, opts }) => {
      try {
        const pluginAPI = new PluginAPI(id, this)
        apply(pluginAPI, opts);
      } catch (e) {
        console.error(
          chalk.red(`Plugin ${id} initialize failed, ${e.message}`)
        );
        console.error(e);
        process.exit(1);
      }
    });

    // webpack config
    this.webpackConfig = getWebpackConfig(this);
  }

  /**
   * 运行
   * @param {String} name Service name
   * @param {Object} args 选项
   */
  run(name, args = {}) {
    // 初始化
    this.init();

    debug(`run ${name} with args ${args}`);

    const command = this.commands[name];

    if (!command && name) {
      console.error(chalk.red(`command "${name}" does not exists.`));
      process.exit(1);
    }

    const { fn } = command;

    /**
     * cwd 工作目录
     * port 端口号
     * plugins 
     */
    return fn(args);
  }
}
