import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '3306'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // 开发环境建议开启，生产环境需关闭
      logging: true,
      extra: {
        authPlugin: 'mysql_native_password' // 解决mysql_native_password插件未加载问题
      }
    }),
    UserModule,
    MenuModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
