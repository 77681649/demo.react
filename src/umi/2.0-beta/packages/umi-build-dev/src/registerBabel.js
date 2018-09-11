/**
 * babel-register
 * 注册babel-register插件, 以便提供实时编译的功能
 */
import { join } from 'path';
import isAbsolute from 'path-is-absolute';
import registerBabel from 'af-webpack/registerBabel';
import flatten from 'lodash.flatten';
import { winPath } from 'umi-utils';
import { CONFIG_FILES } from './constants';

let files = null;

/**
 * 初始化需要编译的文件
 */
function initFiles() {
  if (files) return;

  const env = process.env.UMI_ENV;

  files = [
    ...flatten(
      CONFIG_FILES.map(file => [
        file,
        ...(env ? [file.replace(/\.js$/, `.${env}.js`)] : []),
        file.replace(/\.js$/, `.local.js`),
      ]),
    ),
    'webpack.config.js',
    '.webpackrc.js',
  ];
}

/**
 * 添加babel-register
 */
export function addBabelRegisterFiles(extraFiles) {
  initFiles();
  files.push(...extraFiles);
}

/**
 * 注册 register babel
 * @param {Object} opts 
 */
export default function(opts = {}) {
  
  initFiles();
  
  const { cwd } = opts;
  
  const only = files.map(f => {
    // 获得完整的路径(绝对路径)
    const fullPath = isAbsolute(f) ? f : join(cwd, f);
    
    // 返回使用斜杠分割的路径 "/a/b/c"
    return winPath(fullPath);
  });
  
  // 注册babel-register
  registerBabel({
    only: [only.join('|')],
    babelPreset: [
      require.resolve('babel-preset-umi'),
      { disableTransform: true },
    ],
  });
}
