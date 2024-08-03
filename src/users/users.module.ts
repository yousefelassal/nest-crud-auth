import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PhotosModule } from 'src/photos/photos.module';
import { AuthMiddleware } from 'src/auth/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PhotosModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'users/:id', method: RequestMethod.GET })
      .forRoutes('users/:id');
  }
}
