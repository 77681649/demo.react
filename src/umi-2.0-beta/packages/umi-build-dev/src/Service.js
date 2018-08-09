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
 */
export default class Service {
  constructor({ cwd, plugins }) {
    //
    this.cwd = cwd || process.cwd();

    // 1. 获得package.json
    try {
      this.pkg = require(join(this.cwd, "package.json"));
    } catch (e) {
      this.pkg = {};
    }

    // 2. 注册babel-register
    registerBabel({
      cwd: this.cwd
    });

    // 存储注册的插件方法
    this.pluginMethods = {};

    //
    this.commands = {};

    // 3. 获得配置文件中的配置
    const config = UserConfig.getConfig({
      cwd: this.cwd,
      service: this
    });

    this.config = config;

    debug(`user config: ${JSON.stringify(config)}`);


    // 4. 解析plugins, 返回配置的插件
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
   * 执行指定的插件
   * @param {String}
   * @param {Object} otp 传递个插件方法的参数
   */
  applyPlugins(key, opts = {}) {
    return (this.pluginMethods[key] || []).reduce((memo, { fn }) => {
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
        apply(new PluginAPI(id, this), opts);
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

  run(name, args = {}) {
    this.init();
    debug(`run ${name} with args ${args}`);

    const command = this.commands[name];
    if (!command && name) {
      console.error(chalk.red(`command "${name}" does not exists.`));
      process.exit(1);
    }

    const { fn } = command;
    return fn(args);
  }
}
