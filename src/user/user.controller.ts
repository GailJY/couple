import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body('openid') openid: string): Promise<{ success: boolean; data: User }> {
    const user = await this.userService.createUser(openid);
    return { success: true, data: user };
  }

  @Post('login')
  async login(@Body('code') code: string): Promise<{ success: boolean; data: { token: string } }> {
    const user = await this.userService.loginWithWechat(code);
    const token = this.jwtService.sign({ userId: user.id });
    return { success: true, data: { token } };
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