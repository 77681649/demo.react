#!/usr/bin/env node
const spawn = require('cross-spawn');
const chalk = require('chalk');
const { join, dirname } = require('path');
const { existsSync } = require('fs');

const Service = require('umi-build-dev/lib/Service').default;

const script = process.argv[2];
const args = process.argv.slice(3);

//
// 1. 检查node 版本
//
const nodeVersion = process.versions.node;
const versions = nodeVersion.split('.');
const major = versions[0];
const minor = versions[1];

if (major * 10 + minor * 1 < 65) {
  console.log(`Node version must >= 6.5, but got ${major}.${minor}`);
  process.exit(1);
}

//
// Notify update when process exits
//
const updater = require('update-notifier');
const pkg = require('../package.json');
updater({ pkg: pkg }).notify({ defer: true });

/**
 * 运行脚本
 * @param {String} script 执行脚本名称
 * @param {Array} args 命令参数
 * @param {Boolean} isFork 是否启用子进程
 */
function runScript(script, args, isFork) {
  if (isFork) {

    // sync spawn process
    const child = spawn.sync(
      'node',
      [require.resolve(`../lib/scripts/${script}`)].concat(args),
      {stdio: 'inherit'} // eslint-disable-line
    );

    // exit process
    process.exit(child.status);
  } else {
    require(`../lib/scripts/${script}`);
  }
}

process.env.UMI_DIR = dirname(require.resolve('../package'));

const scriptAlias = {
  g: 'generate' // eslint-disable-line
};
const aliasedScript = scriptAlias[script] || script;

switch (aliasedScript) {
  case '-v':
  case '--version':
    console.log(pkg.version);
    if (existsSync(join(__dirname, '../.local'))) {
      console.log(chalk.cyan('@local'));
    }
    break;
  case 'build':
  case 'dev':
    // require('atool-monitor').emit();
    runScript(aliasedScript, args, /* isFork */true);
    break;
  case 'test':
    runScript(aliasedScript, args);
    break;
  default:
    new Service(
      require('../lib/buildDevOpts').default()
    ).run(script);
    break;
}
