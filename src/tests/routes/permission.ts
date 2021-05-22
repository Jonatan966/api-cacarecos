import request from 'supertest'

export const permissionRoutesTests = (req: request.SuperTest<request.Test>) => {
  describe('Permision routes tests', () => {
    it('Should be able to insert a permission', async () => {
      await req.post('/permissions')
        .send({
          name: 'NEW_TEST'
        })
        .expect(201)
        .expect(/"id":/)
    })

    it('Should be able to find created permission', async () => {
      await req.get('/permissions')
        .expect(/"name":"NEW_TEST"/)
    })

    it('Should not be able to create a permission with the same name', async () => {
      await req.post('/permissions')
        .send({
          name: 'NEW_TEST'
        })
        .expect(400)
        .expect(/"error":/)
    })

    it('Should be able to delete permission', async () => {
      const reqResult = await req.get('/permissions')

      const createdPermission = reqResult.body.results.find(permission => permission.name === 'NEW_TEST')

      await req.delete(`/permissions/${createdPermission.id}`)
        .expect(200)
    })

    it('Should be able to create a temporary permission for next tests', async () => {
      const existentPermissions = (await req.get('/permissions')).body.results

      if (existentPermissions.find(permission => permission.name === 'ROUTES_TEST')) {
        return expect(1).toEqual(1)
      }

      await req.post('/permissions')
        .send({
          name: 'ROUTES_TEST'
        })
        .expect(201)
        .expect(/"id":/)
    })
  })
}
