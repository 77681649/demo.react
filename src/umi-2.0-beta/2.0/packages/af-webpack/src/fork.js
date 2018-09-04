import { fork } from 'child_process';
import send, { RESTART } from './send';

/**
 * fork 子进程
 * @param {String} scriptPath 脚本路径
 * @returns {ChildProcess}
 */
export default function start(scriptPath) {
  const child = fork(scriptPath, process.argv.slice(2));

  child.on('message', data => {
    const type = (data && data.type) || null;

    // 重启
    if (type === RESTART) {
      child.kill();
      start(scriptPath);
    }

    // 发送消息
    send(data);
  });

  return child;
}
