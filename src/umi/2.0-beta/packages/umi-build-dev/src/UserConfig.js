/**
 */
import { join } from 'path';
import { existsSync } from 'fs';
import requireindex from 'requireindex';
import chalk from 'chalk';
import didyoumean from 'didyoumean';
import isEqual from 'lodash.isequal';
import clone from 'lodash.clonedeep';
import flatten from 'lodash.flatten';
import { CONFIG_FILES } from './constants';
import { watch, unwatch } from './getConfig/watch';
import { setConfig as setMiddlewareConfig } from './plugins/commands/dev/createRouteMiddleware';

/**
 * 格式化配置
 * @param {String} config 
 */
function normalizeConfig(config) {
  config = config.default || config;

  if (config.context && config.pages) {
    Object.keys(config.pages).forEach(key => {
      const page = config.pages[key];

      // 合并上下文
      page.context = {
        ...config.context,
        ...page.context,
      };
    });
  }

  // pages 配置补丁
  // /index -> /index.html
  // index -> /index.html
  if (config.pages) {
    const htmlSuffix = !!(
      config.exportStatic &&
      typeof config.exportStatic === 'object' &&
      config.exportStatic.htmlSuffix
    );

    config.pages = Object.keys(config.pages).reduce((memo, key) => {
      let newKey = key;

      // 确保 ".html" 结尾
      if (
        htmlSuffix &&
        newKey.slice(-1) !== '/' &&
        newKey.slice(-5) !== '.html'
      ) {
        newKey = `${newKey}.html`;
      }

      // 确保 "/" 开头
      if (newKey.charAt(0) !== '/') {
        newKey = `/${newKey}`;
      }

      memo[newKey] = config.pages[key];
      return memo;
    }, {});
  }

  return config;
}

/**
 * 获得配置文件
 * @param {String} 应用的工作目录
 * @param {Service} service service实例
 * @returns {String} 返回配置文件的绝对路径
 */
function getConfigFile(cwd, service) {
  const files = CONFIG_FILES.map(file => join(cwd, file)).filter(file =>
    existsSync(file),
  );

  if (files.length > 1) {
    if (service.dev && service.dev.server) {
      service.dev.server.sockWrite(service.dev.server.sockets, 'warns', [
        `Muitiple config files ${files.join(', ')} detected, umi will use ${
          files[0]
        }.`,
      ]);
    }
  }

  return files[0];
}

/**
 * 加载指定文件
 * @param {*} filePath 
 * @param {*} opts 
 */
function requireFile(filePath, opts = {}) {
  if (!existsSync(filePath)) {
    return {};
  }

  const onError =
    opts.onError ||
    function(e) {
      console.error(e);
      return {};
    };
  try {
    const config = require(filePath) || {}; // eslint-disable-line
    return normalizeConfig(config);
  } catch (e) {
    return onError(e, filePath);
  }
}

class UserConfig {
  /**
   * 获得用户配置
   * @param {Object} options 选项
   * @param {String} cwd 应用的工作目录
   * @param {Service} service dev-service实例
   * @return {Object} 返回从配置文件中读取的用户配置
   */
  static getConfig(opts = {}) {
    const { cwd, service } = opts;
    
    // 1. 配置文件的绝对路径
    const absConfigPath = getConfigFile(cwd, service);

    const env = process.env.UMI_ENV;
    const isDev = process.env.NODE_ENV === 'development';

    // 2. 获得默认配置
    const defaultConfig = service.applyPlugins('modifyDefaultConfig', {
      initialValue: {},
    });

    // 3. 合并 && 格式化配置
    if (absConfigPath) {
      return normalizeConfig({
        ...defaultConfig,
        ...requireFile(absConfigPath),
        ...(env
          ? requireFile(absConfigPath.replace(/\.js$/, `.${env}.js`))
          : {}),
        ...(isDev
          ? requireFile(absConfigPath.replace(/\.js$/, '.local.js'))
          : {}),
      });
    } else {
      return {};
    }
  }

  constructor(service) {
    this.service = service;
    this.configFailed = false;
    this.config = null;
    this.file = null;
    this.relativeFile = null;
    this.watch = watch;
    this.unwatch = unwatch;
    this.initConfigPlugins();
  }

  initConfigPlugins() {
    const map = requireindex(join(__dirname, 'getConfig/configPlugins'));
    let plugins = Object.keys(map).map(key => {
      return map[key].default;
    });
    plugins = this.service.applyPlugins('_modifyConfigPlugins', {
      initialValue: plugins,
    });
    this.plugins = plugins.map(p => p(this));
  }

  printError(messages) {
    if (this.service.dev && this.service.dev.server) {
      messages = typeof messages === 'string' ? [messages] : messages;
      this.service.dev.server.sockWrite(
        this.service.dev.server.sockets,
        'errors',
        messages,
      );
    }
  }

  /**
   * 
   * @param {Object} opts 选项
   */
  getConfig(opts = {}) {
    const env = process.env.UMI_ENV;
    const isDev = process.env.NODE_ENV === 'development';
    const { paths, cwd } = this.service;
    const { force, setConfig } = opts;

    //
    //
    //
    const file = getConfigFile(paths.cwd, this.service);
    this.file = file;
    if (!file) {
      return {};
    }

    // 强制读取，不走 require 缓存
    if (force) {
      CONFIG_FILES.forEach(file => {
        delete require.cache[join(paths.cwd, file)];
        delete require.cache[
          join(paths.cwd, file.replace(/\.js$/, `.${env}.js`))
        ];
        delete require.cache[
          join(paths.cwd, file.replace(/\.js$/, `.local.js`))
        ];
      });
    }

    let config = null;
    const relativeFile = file.replace(`${paths.cwd}/`, '');
    this.relativeFile = relativeFile;

    function onError(e, file) {
      const msg = `配置文件 "${file.replace(
        `${paths.cwd}/`,
        '',
      )}" 解析出错，请检查语法。
\r\n${e.toString()}`;
      this.printError(msg);
      throw new Error(msg);
    }

    //
    //
    //
    const defaultConfig = this.service.applyPlugins('modifyDefaultConfig', {
      initialValue: {},
    });

    // 
    //
    //
    config = normalizeConfig({
      ...defaultConfig,
      ...requireFile(file, { onError }),
      ...(env ? requireFile(file.replace(/\.js$/, `.${env}.js`)) : {}),
      ...(isDev ? requireFile(file.replace(/\.js$/, '.local.js')) : {}),
    });

    //
    //
    //
    config = this.service.applyPlugins('modifyConfig', {
      initialValue: config,
    });

    //
    //
    //
    for (const plugin of this.plugins) {
      const { name, validate } = plugin;
      if (config[name] && validate) {
        try {
          plugin.validate.call({ cwd }, config[name]);
        } catch (e) {
          // 校验出错后要把值设到缓存的 config 里，确保 watch 判断时才能拿到正确的值
          if (setConfig) {
            setConfig(config);
          }
          this.printError(e.message);
          throw new Error(`配置 ${name} 校验失败, ${e.message}`);
        }
      }
    }

    // 找下不匹配的 name
    const pluginNames = this.plugins.map(p => p.name);
    Object.keys(config).forEach(key => {
      if (!pluginNames.includes(key)) {
        if (opts.setConfig) {
          opts.setConfig(config);
        }
        const affixmsg = `选择 "${pluginNames.join(', ')}" 中的一项`;
        const guess = didyoumean(key, pluginNames);
        const midMsg = guess ? `你是不是想配置 "${guess}" ？ 或者` : '请';
        const msg = `"${relativeFile}" 中配置的 "${key}" 并非约定的配置项，${midMsg}${affixmsg}`;
        this.printError(msg);
        throw new Error(msg);
      }
    });

    return config;
  }

  setConfig(config) {
    this.config = config;
  }

  watchWithDevServer() {
    // 配置插件的监听
    for (const plugin of this.plugins) {
      if (plugin.watch) {
        plugin.watch();
      }
    }

    // 配置文件的监听
    this.watchConfigs((event, path) => {
      console.log(`[DEBUG] [${event}] ${path}`);
      try {
        const newConfig = this.getConfig({
          force: true,
          setConfig: newConfig => {
            console.log('set config');
            this.config = newConfig;
          },
        });

        // 从失败中恢复过来，需要 reload 一次
        if (this.configFailed) {
          this.configFailed = false;
          this.service.reload();
        }

        const oldConfig = clone(this.config);
        this.config = newConfig;

        for (const plugin of this.plugins) {
          const { name } = plugin;
          if (!isEqual(newConfig[name], oldConfig[name])) {
            this.service.config[name] = newConfig[name];
            this.service.applyPlugins('onConfigChange', {
              args: {
                newConfig,
              },
            });
            if (plugin.onChange) {
              plugin.onChange(newConfig);
            }
          }
        }
      } catch (e) {
        this.configFailed = true;
        console.error(chalk.red(`watch handler failed, since ${e.message}`));
        console.error(e);
      }
    });
  }

  watchConfigs(handler) {
    const env = process.env.UMI_ENV;
    const watcher = this.watch(
      'CONFIG_FILES',
      flatten(
        CONFIG_FILES.map(file => [
          file,
          env ? [file.replace(/\.js$/, `.${env}.js`)] : [],
          file.replace(/\.js$/, `.local.js`),
        ]),
      ),
    );
    if (watcher) {
      watcher.on('all', handler);
    }
  }
}

export default UserConfig;