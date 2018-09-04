import fork from 'umi-build-dev/lib/fork';
import { dirname } from 'path';

process.env.UMI_DIR = dirname(require.resolve('../../package'));

const child = fork(require.resolve('./realDev.js'));

child.on('message', data => {
  // 转发给父进程
  if (process.send) {
    process.send(data);
  }
});

process.on('SIGINT', () => {
  // 关闭自身
  child.kill('SIGINT');
});
