import { compatDirname } from 'umi-utils';
import { dirname } from 'path';

function importPlugin(key) {
  return [
    require.resolve('babel-plugin-import'),
    {
      libraryName: key,
      libraryDirectory: 'es',
      style: true,
    },
    key,
  ];
}

export default function(api) {
  const { cwd } = api.service;

  // 配置antd, antd-mobile 按需加载方案
  api.register('modifyAFWebpackOpts', ({ memo }) => {
    memo.babel.plugins = [
      ...(memo.babel.plugins || []),
      importPlugin('antd'),
      importPlugin('antd-mobile'),
    ];
    return memo;
  });

  api.register('chainWebpackConfig', ({ args: { webpackConfig } }) => {
    webpackConfig.resolve.alias
      .set(
        'antd',
        compatDirname(
          'antd/package.json',
          cwd,
          dirname(require.resolve('antd/package.json')),
        ),
      )
      .set(
        'antd-mobile',
        compatDirname(
          'antd-mobile/package.json',
          cwd,
          dirname(require.resolve('antd-mobile/package.json')),
        ),
      );
  });
}
