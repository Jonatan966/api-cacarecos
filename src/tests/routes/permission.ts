import request from 'supertest'

export const permissionRoutesTests = (req: request.SuperTest<request.Test>) => {
  describe('Permision routes tests', () => {
    it('Should be able to insert a permission', async () => {
      req.post('/permissions')
        .send({
          name: 'NOVO_TESTE'
        })
        .expect(201)
        .expect(/"id":/)
    })

    it('Should be able to find created permission', async () => {
      req.get('/permissions')
        .expect(/"name":"NOVO_TESTE"/)
    })

    it('Should not be able to create a permission with the same name', async () => {
      req.post('/permissions')
        .send({
          name: 'NOVO_TESTE'
        })
        .expect(400)
        .expect(/"error":/)
    })

    it('Should be able to delete permission', async () => {
      const reqResult = await req.get('/permissions')

      const createdPermission = reqResult.body.find(permission => permission.name === 'NOVO_TESTE')

      req.delete(`/permissions/${createdPermission.id}`)
        .expect(200)
    })

    it('Should be able to create a temporary permission for next tests', async () => {
      req.post('/permissions')
        .send({
          name: 'OUTRO_TESTE'
        })
        .expect(201)
        .expect(/"id":/)
    })
  })
}
