import { createConnection } from 'typeorm'

createConnection()
  .then(() => console.log('🌐 Connected with the database!'))
  .catch((reason) => console.log('⛔ Could not connect to the database.\nReason:', reason))
