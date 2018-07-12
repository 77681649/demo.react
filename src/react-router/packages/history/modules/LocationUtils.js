import resolvePathname from 'resolve-pathname'
import valueEqual from 'value-equal'
import { parsePath } from './PathUtils'

/**
 * 创建location对象
 * 
 * @example
 * 
 * // -> { pathname:'/haha' , search:'?a=1' , hash: '#tag' }
 * createLocation(/haha?a=1#tag)
 * 
 * @param {String|Object} path 路径 - 包含pathname,search,hash三部分
 * @param {Object} state 额外的状态
 * @param {String} key key location唯一标识
 * @param {Location} currentLocation 当前的location
 * @returns {Location} 返回创建的location对象
 */
export const createLocation = (path, state, key, currentLocation) => {
  let location
  if (typeof path === 'string') {
    // Two-arg form: push(path, state)
    location = parsePath(path)
    location.state = state
  } else {
    // One-arg form: push(location)
    location = { ...path }

    if (location.pathname === undefined)
      location.pathname = ''

    if (location.search) {
      if (location.search.charAt(0) !== '?')
        location.search = '?' + location.search
    } else {
      location.search = ''
    }

    if (location.hash) {
      if (location.hash.charAt(0) !== '#')
        location.hash = '#' + location.hash
    } else {
      location.hash = ''
    }

    if (state !== undefined && location.state === undefined)
      location.state = state
  }

  try {
    location.pathname = decodeURI(location.pathname)
  } catch (e) {
    if (e instanceof URIError) {
      throw new URIError(
        'Pathname "' + location.pathname + '" could not be decoded. ' +
        'This is likely caused by an invalid percent-encoding.'
      )
    } else {
      throw e
    }
  }

  if (key)
    location.key = key

  // resolvePathname('about', '/company/jobs') // /company/about
  // resolvePathname('../jobs', '/company/team/ceo') // /company/jobs
  // resolvePathname('about') // /about
  // resolvePathname('/about') // /about
  if (currentLocation) {
    // Resolve incomplete/relative pathname relative to current location.
    if (!location.pathname) {
      // 为空, 使用currentLocation.pathname
      location.pathname = currentLocation.pathname
    } else if (location.pathname.charAt(0) !== '/') {
      // location.pathname = '1'
      // currentLocation.pathname = '/ticket/detail/2'
      // -> location.pathname = '/ticket/detail/1'
      location.pathname = resolvePathname(location.pathname, currentLocation.pathname)
    }
  } else {
    // When there is no prior location and pathname is empty, set it to /
    if (!location.pathname) {
      location.pathname = '/'
    }
  }

  return location
}

/**
 * 
 * @param {*} a 
 * @param {*} b 
 */
export const locationsAreEqual = (a, b) =>
  a.pathname === b.pathname &&
  a.search === b.search &&
  a.hash === b.hash &&
  a.key === b.key &&
  valueEqual(a.state, b.state)
