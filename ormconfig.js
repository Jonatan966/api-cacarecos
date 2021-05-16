const configTypes = {
  production: {
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
    },
    url: process.env.DATABASE_URL
  },
  development: {
    entities: [
    'src/app/models/*.ts'
    ],
    migrations: [
      'src/database/migrations/*.ts'
    ],
    cli: {
      migrationsDir: 'src/database/migrations'
    },
    url: process.env.DATABASE_URL
  },
  tests: {
    entities: [
      'src/app/models/*.ts'
    ],
    migrations: [
      'src/database/migrations/*.ts'
    ],  
    cli: {
      migrationsDir: 'src/database/migrations'
    },
    // logging: true,
    url: process.env.DATABASE_TESTS_URL
  }
}

const globalConfigs = {
  type: 'postgres'
}

module.exports = {
  ...globalConfigs,
  ...configTypes[process.env.NODE_ENV ?? 'development']
}