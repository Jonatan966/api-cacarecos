import { DeepPartial, EntityTarget, getRepository } from 'typeorm'

export async function useInsertOnlyNotExists<M = any> (data: DeepPartial<M>, model: EntityTarget<M>, queryData: any) {
  const modelRepository = getRepository(model)

  const itemAlreadyExists = await modelRepository.findOne(queryData)

  if (itemAlreadyExists) {
    return false
  }

  const itemInsertedResult = await modelRepository.save(data)

  return itemInsertedResult
}
