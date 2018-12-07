import assert from 'assert';
import mkdirp from 'mkdirp';
import { dirname, join, relative } from 'path';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import isPlainObject from 'is-plain-object';
import ejs from 'ejs';
import { minify } from 'html-minifier';
import { matchRoutes } from 'react-router-config';
import formatChunksMap from './formatChunksMap';

export default class HTMLGenerator {
  constructor(opts = {}) {
    // 设置选项
    Object.keys(opts).forEach(key => {
      this[key] = opts[key];
    });
    
    // chunks-map ( key.extname - file )
    if (this.chunksMap) {
      this.chunksMap = formatChunksMap(this.chunksMap);
    }

    // 环境变量
    if (!this.env) {
      this.env = process.env.NODE_ENV;
    }

    // 是否压缩
    if (!('minify' in this)) {
      this.minify =
        this.env === 'production' && process.env.COMPRESS !== 'none';
    }
  }

  /**
   * 
   */
  generate() {
    assert(
      this.env === 'production',
      `HtmlGenerator.generate() should only be used in umi build`,
    );

    // 
    // 扁平化路由
    //
    const flatRoutes = this.getFlatRoutes(this.routes);
    assert(flatRoutes.length, 'no valid routes found');

    const routes = this.config.exportStatic 
      ? flatRoutes 
      : [{ path: '/' }]; 

    return routes.map(route => {
      return {
        filePath: this.getHtmlPath(route.path),   // 创建路由对应的 Html 路径
        content: this.getContent(route),          // 
      };
    });
  }

  routeWithoutRoutes(route) {
    const newRoute = { ...route };
    delete newRoute.routes;
    return newRoute;
  }

  getFlatRoutes(routes) {
    return routes.reduce((memo, route) => {
      if (route.routes) {
        return memo
          .concat(this.routeWithoutRoutes(route))
          .concat(this.getFlatRoutes(route.routes));
      } else {
        if (route.path) {
          memo.push(route);
        }
        return memo;
      }
    }, []);
  }

  getHtmlPath(path) {
    const { exportStatic } = this.config;
    const htmlSuffix =
      exportStatic && isPlainObject(exportStatic) && exportStatic.htmlSuffix;

    if (path === '/') {
      return 'index.html';
    }

    // remove first and last slash
    path = path.replace(/^\//, '');
    path = path.replace(/\/$/, '');

    if (htmlSuffix) {
      return `${path}`;
    } else {
      return `${path}/index.html`;
    }
  }

  getMatchedContent(path) {
    const { config } = this;
    if (config.exportStatic) {
      const branch = matchRoutes(this.routes, path).filter(r => r.route.path);
      const route = branch.length ? branch[branch.length - 1].route : { path };
      return this.getContent(route);
    } else {
      const flatRoutes = this.getFlatRoutes(this.routes);
      assert(flatRoutes.length, `routes should not be empty`);
      return this.getContent(flatRoutes[0]);
    }
  }

  // 获取顺序：
  // route.document > pages/document.ejs > built-in document.ejs
  getDocumentTplPath(route) {
    const { cwd, absPageDocumentPath, defaultDocumentPath } = this.paths;

    if (route.document) {
      const docPath = join(cwd, route.document);
      assert(existsSync(docPath), `document ${route.document} don't exists.`);
      return docPath;
    }

    if (existsSync(absPageDocumentPath)) {
      return absPageDocumentPath;
    }

    return defaultDocumentPath;
  }

  getStylesContent(styles) {
    return styles
      .map(({ content, ...attrs }) => {
        
        attrs = Object.keys(attrs).reduce((memo, key) => {
          return memo.concat(`${key}="${attrs[key]}"`);
        }, []);

        return [
          `<style${attrs.length ? ' ' : ''}${attrs.join(' ')}>`,
          content
            .split('\n')
            .map(line => `  ${line}`)
            .join('\n'),
          '</style>',
        ].join('\n');
      })
      .join('\n');
  }

  getLinksContent(links) {
    return links
      .map(link => {
        return [
          '<link',
          ...Object.keys(link).reduce((memo, key) => {
            return memo.concat(`${key}="${link[key]}"`);
          }, []),
          '/>',
        ].join(' ');
      })
      .join('\n');
  }

  getMetasContent(metas) {
    return metas
      .map(meta => {
        return [
          '<meta',
          ...Object.keys(meta).reduce((memo, key) => {
            return memo.concat(`${key}="${meta[key]}"`);
          }, []),
          '/>',
        ].join(' ');
      })
      .join('\n');
  }

  getScriptsContent(scripts) {

    return scripts
      .map(({ content, ...attrs }) => {
        if (content && !attrs.src) {
          attrs = Object.keys(attrs).reduce((memo, key) => {
            return memo.concat(`${key}="${attrs[key]}"`);
          }, []);

          return [
            `<script${attrs.length ? ' ' : ''}${attrs.join(' ')}>`,
            content
              .split('\n')
              .map(line => `  ${line}`)
              .join('\n'),
            '</script>',
          ].join('\n');
        } else {
          attrs = Object.keys(attrs).reduce((memo, key) => {
            return memo.concat(`${key}="${attrs[key]}"`);
          }, []);

          return `<script ${attrs.join(' ')}></script>`;
        }
      })
      .join('\n');
  }

  /**
   * 返回hashed之后的文件名
   * @param {String} filename 
   * @returns {String} 返回hashed之后的文件
   */
  getHashedFileName(filename) {
    const isProduction = this.env === 'production';

    if (isProduction) {
      assert(
        this.chunksMap[filename],
        `file ${filename} don't exists in chunksMap`,
      );

      return this.chunksMap[filename];
    } else {
      return filename;
    }
  }

  getContent(route) {
    const { cwd } = this.paths;
    const { exportStatic, runtimePublicPath } = this.config;

    let context = {
      route,                              // 路由配置
      config: this.config,                // 配置
      ...(this.config.context || {}),     // 上下文
      env: this.env,                      // env
    };  

    if (this.modifyContext) {
      context = this.modifyContext(context, route);
    }

    const tplPath = this.getDocumentTplPath(route); // document.ejs 绝对路径
    const relTplPath = relative(cwd, tplPath);      // doucment.ejs 相对路径
    const tpl = readFileSync(tplPath, 'utf-8');     // document.ejs 内容

    assert(
      tpl.includes('<head>') && tpl.includes('</head>'),
      `Document ${relTplPath} must contain <head> and </head>`,
    );

    assert(
      tpl.includes('<body') && tpl.includes('</body>'),
      `Document ${relTplPath} must contain <body> and </body>`,
    );

    // 渲染模板
    let html = ejs.render(tpl, context, {
      _with: false,
      localsName: 'context',
    });

    // validate tpl
    assert(
      html.includes(`<div id="${this.config.mountElementId}"></div>`),
      `Document ${relTplPath} must contain <div id="${
        this.config.mountElementId
      }"></div>`,
    );

    let metas = [];           // head <meta>
    let links = [];           // head <link>
    let scripts = [];         // head <script>
    let styles = [];          // head <style>
    let headScripts = [];     // 

    let routerBaseStr = JSON.stringify(this.config.base || '/');
    const publicPath = this.publicPath || '/';
    let publicPathStr = JSON.stringify(publicPath);

    if (exportStatic && exportStatic.dynamicRoot) {
      routerBaseStr = `location.pathname.split('/').slice(0, -${route.path.split(
        '/',
      ).length - 1}).concat('').join('/')`;
      publicPathStr = 'location.origin + window.routerBase';
    }

    if (this.modifyRouterBaseStr) {
      routerBaseStr = this.modifyRouterBaseStr(routerBaseStr, { route });
    }
    if (this.modifyPublicPathStr) {
      publicPathStr = this.modifyPublicPathStr(publicPathStr);
    }

    const setPublicPath = runtimePublicPath || (exportStatic && exportStatic.dynamicRoot);
    
    //
    // 设置路径
    //
    headScripts.push({
      content: [
        `window.routerBase = ${routerBaseStr};`,
        ...(setPublicPath ? [`window.publicPath = ${publicPathStr};`] : []),
      ].join('\n'),
    });

    //
    // add "umi.js"
    //
    scripts.push({
      src: `<%= pathToPublicPath %>${this.getHashedFileName('umi.js')}`,
    });

    if (this.modifyMetas) metas = this.modifyMetas(metas);
    if (this.modifyLinks) links = this.modifyLinks(links);
    if (this.modifyScripts) scripts = this.modifyScripts(scripts);
    if (this.modifyStyles) styles = this.modifyStyles(styles);
    if (this.modifyHeadScripts) headScripts = this.modifyHeadScripts(headScripts);

    //
    // add "umi.css"
    //
    if (this.env === 'development' || this.chunksMap['umi.css']) {
      // umi.css should be the last one stylesheet
      links.push({
        rel: 'stylesheet',
        href: `<%= pathToPublicPath %>${this.getHashedFileName('umi.css')}`,
      });
    }

    // 
    // insert "head tag" to <head>
    //
    html = html.replace(
      '<head>',
      `
<head>
${metas.length ? this.getMetasContent(metas) : ''}
${links.length ? this.getLinksContent(links) : ''}
${styles.length ? this.getStylesContent(styles) : ''}
    `.trim() + '\n',
    );

    //
    // insert "head script" to <head>
    //
    html = html.replace(
      '</head>',
      `
${headScripts.length ? this.getScriptsContent(headScripts) : ''}
</head>
    `.trim(),
    );

    //
    //
    //
    html = html.replace(
      '</body>',
      `
${scripts.length ? this.getScriptsContent(scripts) : ''}
</body>
    `.trim(),
    );

    //
    // 生成 publicPath
    //
    const relPathToPublicPath = this.getRelPathToPublicPath(route.path);
    
    const pathToPublicPath =
      exportStatic && exportStatic.dynamicRoot
        ? relPathToPublicPath
        : publicPath;

    html = html.replace(/<%= pathToPublicPath %>/g, pathToPublicPath);

    if (this.modifyHTML) {
      html = this.modifyHTML(html, { route });
    }


    if (this.minify) {
      html = minify(html, {
        removeAttributeQuotes: false, // site don't support no quote attributes
        collapseWhitespace: true,
      });
    }

    return html;
  }

  getRelPathToPublicPath(path) {
    const htmlPath = this.getHtmlPath(path);
    const len = htmlPath.split('/').length;
    return Array(len).join('../') || './';
  }
}
