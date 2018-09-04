import getConfig from 'af-webpack/getConfig';
import assert from 'assert';

export default function(service) {
  // 1. 获得af-webpack option
  const afWebpackOpts = service.applyPlugins('modifyAFWebpackOpts', {
    initialValue: {
      cwd: service.cwd,
    },
  });

  assert(
    !('chainConfig' in afWebpackOpts),
    `chainConfig should not supplied in modifyAFWebpackOpts`,
  );

  // 2. 使用chainConfig 修改
  afWebpackOpts.chainConfig = webpackConfig => {
    service.applyPlugins('chainWebpackConfig', {
      args: { webpackConfig },
    });
  };

  // 通过 webpack-chain 扩展 webpack 配置
  let webpackConfig = getConfig(afWebpackOpts);

  // 直接修改 webpack 对象
  // deprecated
  webpackConfig = service.applyPlugins('modifyWebpackConfig', {
    initialValue: webpackConfig,
  });

  return webpackConfig;
}
