import { Router } from 'express'

import { RouteList } from '@interfaces/RouteList'

export function loadRoutes (routesObject: RouteList, expressRouter: Router) {
  const routePaths = Object.keys(routesObject)

  for (const routePath of routePaths) {
    let routeMethods = Object.keys(routesObject[routePath])

    const globalMiddlewares = routeMethods
      .includes('globalMiddlewares')
      ? routesObject[routePath].globalMiddlewares
      : []

    routeMethods = routeMethods.filter(routeMethod =>
      routeMethod !== 'globalMiddlewares'
    )

    routeMethods.forEach(routeMethod => {
      expressRouter[routeMethod](
        routePath,
        globalMiddlewares,
        routesObject[routePath][routeMethod]
      )
    })
  }
}
