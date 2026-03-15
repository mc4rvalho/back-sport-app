import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { Bcrypt } from '../auth/bcrypt/bcrypt';

@Module({
  controllers: [UsersController],
  providers: [UsersService, Bcrypt],
  exports: [UsersService],
})
export class UsersModule {}
