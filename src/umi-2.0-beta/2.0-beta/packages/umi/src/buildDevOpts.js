/**
 * 创建 build dev options
 */
import { join } from 'path';
import isAbsolute from 'path-is-absolute';
import isWindows from 'is-windows';
import slash from 'slash2';

/**
 * 初始化 dev options
 */
export default function(opts = {}) {
  let cwd = opts.cwd || process.env.APP_ROOT;

  //
  // 格式化 cwd
  //
  if (cwd) {
    // relative path -> absolute path
    if (!isAbsolute(cwd)) {
      cwd = join(process.cwd(), cwd);
    }

    // window slash -> linux slash
    // slash("ss\\aa\\s") -> "ss/a/s"
    cwd = slash(cwd);
    
    // 原因：webpack 的 include 规则得是 "\" 才能判断出是绝对路径
    if (isWindows()) {
      cwd = cwd.replace(/\//g, '\\');
    }
  }

  return {
    cwd,
  };
}
