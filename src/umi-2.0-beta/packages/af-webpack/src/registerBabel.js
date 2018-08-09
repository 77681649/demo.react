/**
 * 注册 babel-register 模块
 * @param {Object} opts 选项
 * @param {Array} opts.only 指定only
 * @param {Array} opts.ignore 指定ignore
 * @param {Array} opts.babelPreset 指定presets
 * @param {Boolean} [opts.disablePreventTest=false]
 */
export default function registerBabel(opts = {}) {
  const { only, ignore, babelPreset, disablePreventTest } = opts;
  
  if (disablePreventTest || process.env.NODE_ENV !== 'test') {
    process.env.BABEL_DISABLE_CACHE = 1;
    
    require('@babel/register')({
      // eslint-disable-line
      presets: [babelPreset],
      plugins: [
        require.resolve('babel-plugin-add-module-exports'),
        require.resolve('@babel/plugin-transform-modules-commonjs'),
      ],
      only,
      ignore,
      babelrc: false,
      cache: false,
    });
  }
}
