/**
 * 补全 头部"/" 
 * 
 * @example
 * addLeadingSlash('home') -> '/home'
 * addLeadingSlash('/home') -> '/home'
 * 
 * @param {String} path 
 * @retuns {String}
 */
export const addLeadingSlash = (path) =>
  path.charAt(0) === '/' ? path : '/' + path

/**
 * 去掉 头部"/"
 * 
 * @example
 * stripLeadingSlash('home') -> 'home'
 * stripLeadingSlash('/home') -> 'home'
 * 
 * @param {String} path 
 * @retuns {String}
 */
export const stripLeadingSlash = (path) =>
  path.charAt(0) === '/' ? path.substr(1) : path

/**
 * 
 * @param {String} path 
 * @param {String} prefix 
 * @returns {Boolean}
 */
export const hasBasename = (path, prefix) => 
  (new RegExp('^' + prefix + '(\\/|\\?|#|$)', 'i')).test(path)

/**
 * 去掉 basename
 * 
 * @example
 * stripBasename('/flight/home',"/flight") -> '/home'
 * stripBasename('/home',"/flight") -> '/home'
 * 
 * @param {String} path 
 * @param {String} prefix basename
 * @retuns {String} 
 */
export const stripBasename = (path, prefix) =>
  hasBasename(path, prefix) ? path.substr(prefix.length) : path

/**
 * 去掉 尾部"/" 
 * 
 * @example
 * addLeadingSlash('home') -> 'home'
 * addLeadingSlash('home/') -> 'home'
 * 
 * @param {String} path 
 * @retuns {String}
 */
export const stripTrailingSlash = (path) =>
  path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path

/**
 * 解析path - 将path字符串解析为location对象
 * 
 * @example
 * // {pathname:"/user/list" , search:"?order_key=id&order_dir=asc" , hash:"#tag" }
 * parsePath('/user/list?order_key=id&order_dir=asc#tag')
 * 
 * @param {String} path 路径字符串 
 * @returns {Location} 返回一个{pathname,search,hash}对象
 */
export const parsePath = (path) => {
  let pathname = path || '/'
  let search = ''
  let hash = ''

  const hashIndex = pathname.indexOf('#')
  if (hashIndex !== -1) {
    hash = pathname.substr(hashIndex)
    pathname = pathname.substr(0, hashIndex)
  }

  const searchIndex = pathname.indexOf('?')
  if (searchIndex !== -1) {
    search = pathname.substr(searchIndex)
    pathname = pathname.substr(0, searchIndex)
  }

  return {
    pathname,
    search: search === '?' ? '' : search,
    hash: hash === '#' ? '' : hash
  }
}

/**
 * 创建path - 将location还原为path字符串
 * 
 * @example
 * // -> "/user/list?order_key=id&order_dir=asc#tag"
 * createPath({pathname:"/user/list" , search:"order_key=id&order_dir=asc" , hash:"tag" })
 * 
 * @param {Location} location 浏览位置信息
 * @returns {String} 返回创建好的路径
 */
export const createPath = (location) => {
  const { pathname, search, hash } = location

  let path = pathname || '/'

  if (search && search !== '?')
    path += (search.charAt(0) === '?' ? search : `?${search}`)

  if (hash && hash !== '#')
    path += (hash.charAt(0) === '#' ? hash : `#${hash}`)


  return path
}
