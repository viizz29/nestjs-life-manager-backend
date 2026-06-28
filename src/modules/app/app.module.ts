import {
  DB_DATABASE,
  DB_PASSWORD,
  DB_USERNAME,
  FRONTEND_BUILD_PATH,
  SOCKETIO_ENDPOINT_ON,
} from '../../config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatModule } from '../chat/chat.module';
import { DataNodesModule } from '../data-nodes/data-nodes.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BookmarksModule } from '../bookmarks/bookmarks.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

const imports = [
  AuthModule,
  UsersModule,
  DataNodesModule,
  BookmarksModule,
  SequelizeModule.forRoot({
    dialect: 'postgres', // or 'mysql', 'sqlite', etc.
    host: 'localhost',
    port: 5432,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    autoLoadModels: true, // Automatically load models registered in modules
    synchronize: false, // Sync models with DB (don't use true in production!)
    define: {
      underscored: true, // This automatically maps isActive to is_active globally
    },
  }),
  ServeStaticModule.forRoot({
    rootPath: FRONTEND_BUILD_PATH,
  }),
];

if (SOCKETIO_ENDPOINT_ON) {
  imports.push(ChatModule);
}

@Module({
  imports,
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
