/**
 * IPC - 向父进程发送消息
 */
const debug = require('debug')('af-webpack:send');

export const DONE = 'DONE';
export const STARTING = 'STARTING';
export const RESTART = 'RESTART';

/**
 * IPC - 向父进程发送消息
 * @param {Any} message 消息
 */
export default function send(message) {
  if (process.send) {
    debug(`send ${JSON.stringify(message)}`);
    process.send(message);
  }
}
