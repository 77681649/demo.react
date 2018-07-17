import pathToRegexp from "path-to-regexp";

const patternCache = {};
const cacheLimit = 10000;
let cacheCount = 0;

/**
 * 
 * @param {String} pattern 模式
 * @param {Object} options 选项 
 */
const compilePath = (pattern, options) => {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
  const cache = patternCache[cacheKey] || (patternCache[cacheKey] = {});

  if (cache[pattern]) return cache[pattern];

  const keys = [];
  const re = pathToRegexp(pattern, keys, options);
  const compiledPattern = { re, keys };

  if (cacheCount < cacheLimit) {
    cache[pattern] = compiledPattern;
    cacheCount++;
  }

  return compiledPattern;
};

/**
 * Public API for matching a URL pathname to a path pattern.
 * 
 * @param {String} pathname 待匹配路径
 * @param {Object} option 选项
 * @param {String} option.path 匹配模式
 * @param {Boolean} option.exact 是否精确匹配
 * @param {Boolean} option.strict 是否严格匹配
 * @param {Boolean} option.sensitive 是否区分大小
 * @param {Object} parent 
 */
const matchPath = (pathname, options = {}, parent) => {
  if (typeof options === "string") options = { path: options };

  const { path, exact = false, strict = false, sensitive = false } = options;

  // 如果没有设置path
  // 返回父级匹配
  if (path == null) return parent;

  const { re, keys } = compilePath(path, { end: exact, strict, sensitive });
  const match = re.exec(pathname);

  if (!match) return null;

  const [url, ...values] = match;
  const isExact = pathname === url;

  if (exact && !isExact) return null;

  return {
    path, // the path pattern used to match
    url: path === "/" && url === "" ? "/" : url, // the matched portion of the URL
    isExact, // whether or not we matched exactly
    params: keys.reduce((memo, key, index) => {
      memo[key.name] = values[index];
      return memo;
    }, {})
  };
};

export default matchPath;
