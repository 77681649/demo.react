/**
 * getRouteConfig
 * 
 */
import { join } from 'path';
import { existsSync } from 'fs';
import getRouteConfigFromConfig from './getRouteConfigFromConfig';
import getRouteConfigFromConfigFile from './getRouteConfigFromConfigFile';
import getRouteConfigFromDir from './getRouteConfigFromDir';
import patchRoutes from './patchRoutes';

export default (paths, config = {}) => {
  let routes = null;

  const routeConfigFile = join(paths.absSrcPath, '_routes.json');

  //
  // 获得 routes
  //
  if (config.routes) {
    // from user config
    routes = getRouteConfigFromConfig(config.routes, paths.pagesPath);
  } else if (existsSync(routeConfigFile)) {
    // from _routes.json
    routes = getRouteConfigFromConfigFile(routeConfigFile);
  } else {
    // from pages directory
    routes = getRouteConfigFromDir(paths);
  }

  //
  // 
  //
  patchRoutes(routes, config, process.env.NODE_ENV === 'production');
  
  return routes;
};
