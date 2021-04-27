const configs = process.env.NODE_ENV == 'prod' ? {
  entities: [
    'dist/app/models/*.js'
  ],
  migrations: [
    'dist/database/migrations/*.js'
  ],
  cli: {
    migrationsDir: 'dist/database/migrations'
  },
  ssl: {
    rejectUnauthorized: false
  }
} : {
  entities: [
    'src/app/models/*.ts'
  ],
  migrations: [
    'src/database/migrations/*.ts'
  ],
  cli: {
    migrationsDir: 'src/database/migrations'
  },
  synchronize: true,
}

module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  ...configs
}