import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body('openid') openid: string): Promise<{ success: boolean; data: User }> {
    const user = await this.userService.createUser(openid);
    return { success: true, data: user };
  }

  @Post('bind')
  async bindCouple(
    @Body('userId') userId: number,
    @Body('coupleId') coupleId: number
  ): Promise<{ success: boolean }> {
    await this.userService.bindCouple(userId, coupleId);
    return { success: true };
  }

  @Post('find')
  async findByOpenid(@Body('openid') openid: string): Promise<{ success: boolean; data: User | null }> {
    const user = await this.userService.findByOpenid(openid);
    return { success: true, data: user };
  }
}