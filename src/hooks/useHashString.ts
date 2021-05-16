import { hash, genSalt } from 'bcrypt'

export async function useHashString (data: string, saltRounds = 7) {
  const hashSalt = await genSalt(saltRounds)

  const finalHash = await hash(data, hashSalt)

  return finalHash
}
