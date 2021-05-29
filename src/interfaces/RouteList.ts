export interface RouteList {
  [route: string]: {
    get?: Function | Function[]
    post?: Function | Function[]
    put?: Function | Function[]
    patch?: Function | Function[]
    delete?: Function | Function[]
    globalMiddlewares?: Function | Function[]
  }
}
