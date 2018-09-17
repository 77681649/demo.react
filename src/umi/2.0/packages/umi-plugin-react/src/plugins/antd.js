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
  const { cwd, compatDirname } = api;

  //
  // add af-webpack option: 新增 babel-plugin-import 插件
  // 
  api.modifyAFWebpackOpts(opts => {
    opts.babel.plugins = [
      ...(opts.babel.plugins || []),
      importPlugin('antd'),
      importPlugin('antd-mobile'),
    ];
    return opts;
  });

  //
  // add alias - 确保应用正确
  //
  api.chainWebpackConfig(webpackConfig => {
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
