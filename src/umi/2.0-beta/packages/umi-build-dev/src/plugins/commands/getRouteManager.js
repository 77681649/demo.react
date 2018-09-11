import getRouteConfig from '../../routes/getRouteConfig';

/**
 * 返回一个Route Manager
 * @param {*} service 
 */
export default function(service) {
  const { paths, config } = service;
  
  return {
    routes: null,

    /**
     * 获得routes
     */
    fetchRoutes() {
      this.routes = service.applyPlugins('modifyRoutes', {
        initialValue: getRouteConfig(paths, config),
      });

      service.routes = this.routes;
    },
  };
}
