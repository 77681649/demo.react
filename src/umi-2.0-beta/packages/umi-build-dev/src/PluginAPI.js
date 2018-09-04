import debug from 'debug';
import assert from 'assert';
import {
  PLACEHOLDER_IMPORT,
  PLACEHOLDER_RENDER,
  PLACEHOLDER_ROUTER_MODIFIER,
  PLACEHOLDER_ROUTES_MODIFIER,
  PLACEHOLDER_HISTORY_MODIFIER,
} from './constants';
import registerBabel, { addBabelRegisterFiles } from './registerBabel';

/**
 * 
 * @example
 * 属性
 * id           String
 * service      Service
 * debug        Debug
 * utils        Object 工具函数
 * placeholder  Object 占位符
 */
class PluginAPI {
  constructor(id, service) {
    this.id = id;
    this.service = service;
    this.debug = debug(`umi-plugin: ${id}`);

    // deprecated
    this.utils = {
      // private for umi-plugin-dll
      _webpack: require('af-webpack/webpack'),
      _afWebpackGetConfig: require('af-webpack/getConfig').default,
      _afWebpackBuild: require('af-webpack/build').default,
      _webpackHotDevClientPath: require('af-webpack/react-dev-utils')
        .webpackHotDevClientPath,
    };

    // deprecated
    this.placeholder = {
      IMPORT: PLACEHOLDER_IMPORT,
      RENDER: PLACEHOLDER_RENDER,
      ROUTER_MODIFIER: PLACEHOLDER_ROUTER_MODIFIER,
      ROUTES_MODIFIER: PLACEHOLDER_ROUTES_MODIFIER,
      HISTORY_MODIFIER: PLACEHOLDER_HISTORY_MODIFIER,
    };
  }

  /**
   * 注册 plugin method 
   * @param {String} key pluginMethod name
   * @param {Function} fn 
   */
  register(key, fn) {
    if (!this.service.pluginMethods[key]) {
      this.service.pluginMethods[key] = [];
    }

    this.service.pluginMethods[key].push({
      fn,
    });
  }

  /**
   * 注册 command
   * @param {String} name 名称
   * @param {Object} [opts] 选项
   * @param {Function} fn 执行函数
   */
  registerCommand(name, opts, fn) {
    if (typeof opts === 'function') {
      fn = opts;
      opts = null;
    }

    this.service.commands[name] = { fn, opts: opts || {} };
  }

  /**
   * 注册 修改webpack config 插件方法
   */
  modifyWebpackConfig(fn) {
    this.register('modifyWebpackConfig', fn);
  }

  /**
   * 注册 chain webpack 插件方法
   */
  chainWebpack(fn) {
    this.register('chainWebpackConfig', ({ args: { webpackConfig } }) => {
      fn(webpackConfig);
    });
  }

  /**
   * 注册 babel-register 文件
   */
  registerBabel(files) {
    assert(
      Array.isArray(files),
      `[PluginAPI] files for registerBabel must be Array, but got ${files}`,
    );
    addBabelRegisterFiles(files);
    registerBabel({
      cwd: this.service.cwd,
    });
  }
}

export default PluginAPI;
