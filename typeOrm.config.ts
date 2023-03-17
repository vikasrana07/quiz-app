import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { CreateUsersTable1632591678454 } from './apps/api/src/migrations/1632591678454-create-users-table';
import { CreateRolesTable1632592162862 } from './apps/api/src/migrations/1632592162862-create-roles-table';
import { CreateUsersRolesTable1632592716980 } from './apps/api/src/migrations/1632592716980-create-users-roles-table';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.get('MYSQL_HOST'),
  port: configService.get('MYSQL_PORT'),
  username: configService.get('MYSQL_USER'),
  password: configService.get('MYSQL_PASSWORD'),
  database: configService.get('MYSQL_DATABASE'),
  entities: [],
  migrations: [
    CreateUsersTable1632591678454,
    CreateRolesTable1632592162862,
    CreateUsersRolesTable1632592716980,
  ],
});
