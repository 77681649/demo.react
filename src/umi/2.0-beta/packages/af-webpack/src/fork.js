import { fork, ChildProcess } from 'child_process';
import send, { RESTART } from './send';

/**
 * fork process
 * @param {String} scriptPath 执行脚本的路径
 * @returns {ChildProcess} 返回子进程
 */
export default function start(scriptPath) {
  const child = fork(scriptPath, process.argv.slice(2));

  //
  // 处理来自child_process的消息
  //  1. 处理restart
  //  2. 当child_process接受到来自子进程的消息时, 应该转换给父进程
  //
  child.on('message', data => {
    const type = (data && data.type) || null;
    
    // 判断消息类型
    if (type === RESTART) {
      // 终止子进程
      child.kill('SIGINT'); 

      // 重启
      start(scriptPath);
    }

    // 向发进程发送消息
    send(data);
  });

  return child;
}
