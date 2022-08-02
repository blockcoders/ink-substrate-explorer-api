import 'dotenv/config'
import { DataSource } from 'typeorm'

export const connectionSource = new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.NODE_ENV === 'production' ? false : true,
  dropSchema: false,
  logging: process.env.NODE_ENV === 'development' ? true : false,
  entities: [`${__dirname}/src/**/**.entity{.ts,.js}`],
  migrations: [`${__dirname}/src/migrations/**/*{.ts,.js}`],
  migrationsTableName: 'migrations',
})
