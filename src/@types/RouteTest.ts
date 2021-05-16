import request from 'supertest'

export type RouteTest = (req: request.SuperTest<request.Test>) => void
