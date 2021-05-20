import { Router } from 'express'

import { RouteList } from '@interfaces/RouteList'

export function loadRoutes (routesObject: RouteList, expressRouter: Router) {
  const routePaths = Object.keys(routesObject)

  for (const routePath of routePaths) {
    const routeMethods = Object.keys(routesObject[routePath])

    routeMethods.forEach(routeMethod => {
      expressRouter[routeMethod](
        routePath,
        routesObject[routePath][routeMethod]
      )
    })
  }
}
