import { dirname, join } from 'path';
import { existsSync } from 'fs';

/**
 * 获得
 * @param {string} path 路径
 * @param {string} cwd 工作目录
 * @param {string} fallback 后援路径
 */
export default function(path, cwd, fallback) {
  // cwd/package.json 获得path目录路径
  const pkg = findPkg(path, cwd);
  if (pkg) return pkg;

  // 从当前工作目录找package.json
  if (cwd !== process.cwd()) {
    const pkg = findPkg(path, process.cwd());
    if (pkg) return pkg;
  }

  // 返回fallback
  return fallback;
}

/**
 * 查找pkg
 * @param {string} path 路径
 * @param {string} cwd 工作目录
 * @returns {string} 如果是package.json的依赖, 那么返回path所在目录路径
 */
function findPkg(path, cwd) {
  // 获得当前工作目录的package.json
  const pkgPath = join(cwd, 'package.json');

  // 库名
  const library = path.split('/')[0];

  // 如果cwd存在package.json
  if (existsSync(pkgPath)) {
    const { dependencies = {} } = require(pkgPath); // eslint-disable-line
    if (dependencies[library]) {
      return dirname(join(cwd, 'node_modules', path));
    }
  }
}
