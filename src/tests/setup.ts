import { createConnection, getConnection, getConnectionOptions } from 'typeorm'

export async function connectToDatabase () {
  try {
    getConnection()
  } catch {
    const options = (await getConnectionOptions())
    await createConnection(options)
  }
}
