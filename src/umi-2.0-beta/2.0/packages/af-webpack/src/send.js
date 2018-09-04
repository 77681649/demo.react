const debug = require('debug')('af-webpack:send');

export const DONE = 'DONE';
export const STARTING = 'STARTING';
export const RESTART = 'RESTART';

/**
 * 发送消息个父进程
 * @param {Any} message 消息
 */
export default function send(message) {
  if (process.send) {
    debug(`send ${JSON.stringify(message)}`);
    process.send(message);
  }
}
