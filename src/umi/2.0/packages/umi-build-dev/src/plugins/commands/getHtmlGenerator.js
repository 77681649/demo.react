/**
 * 构建
 *
 * @author    王骁(Sean Wang) <Sean.Wang@u-technologies.com>
 */
import cheerio from 'cheerio';
import HtmlGenerator from '../../html/HTMLGenerator';

export default (service, opts = {}) => {
  const { config, paths, webpackConfig, routes } = service;   // 参数
  const { chunksMap } = opts;                                 // chunk-files 映射关系
  
  //
  // 创建 HTML 生成器
  //
  return new HtmlGenerator({
    config,                                       // 配置
    paths,                                        // 路径
    routes,                                       // 路由配置
    publicPath: webpackConfig.output.publicPath,  // 公共路径
    chunksMap,                                    // chunksMap

    //
    //
    //
    modifyContext(context, route) {
      return service.applyPlugins('modifyHTMLContext', {
        initialValue: context,
        args: { route },
      });
    },

    //
    //
    //
    modifyRouterBaseStr(str) {
      return str;
    },

    //
    //
    //
    modifyPublicPathStr(str) {
      return str;
    },

    //
    //
    //
    modifyMetas(memo) {
      return service.applyPlugins('addHTMLMeta', {
        initialValue: memo,
      });
    },

    //
    //
    //
    modifyLinks(memo) {
      return service.applyPlugins('addHTMLLink', {
        initialValue: memo,
      });
    },

    //
    //
    //
    modifyScripts(memo) {
      return service.applyPlugins('addHTMLScript', {
        initialValue: memo,
      });
    },

    //
    //
    //
    modifyStyles(memo) {
      return service.applyPlugins('addHTMLStyle', {
        initialValue: memo,
      });
    },

    //
    //
    //
    modifyHeadScripts(memo) {
      return service.applyPlugins('addHTMLHeadScript', {
        initialValue: memo,
      });
    },

    //
    //
    //
    modifyHTML(memo, { route }) {
      const $ = cheerio.load(memo);

      service.applyPlugins('modifyHTMLWithAST', {
        initialValue: $,
        args: {
          route,
        },
      });
      
      return $.html();
    },
  });
};
