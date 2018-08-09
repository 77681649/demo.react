import yParser from 'yargs-parser';
import buildDevOpts from '../buildDevOpts';

// 
// 1. 修复 Ctrl+C 时 dev server 没有正常退出的问题
//
process.on('SIGINT', () => {
  process.exit(1);
});

//
// 2. NODE_ENV = "development"
//
process.env.NODE_ENV = 'development';

//
// 3. 初始化 dev options
// 
const argv = yParser(process.argv.slice(2));
const opts = {
  ...argv,
  plugins: argv.plugins ? argv.plugins.split(',') : [],
};
const devOpts = buildDevOpts(opts)

//
// 4. 启动dev server
// 
const Service = require('umi-build-dev/lib/Service').default;
new Service(devOpts).run('dev', opts);
