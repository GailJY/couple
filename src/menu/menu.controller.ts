import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { MenuService } from './menu.service';
import { Menu } from './menu.entity';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @Body('userId') userId: number,
    @Body('name') name: string,
    @Body('price') price: number,
    @Body('remark') remark: string,
    @Body('imagePath') imagePath: string
  ): Promise<{ success: boolean; data: Menu }> {
    const menu = await this.menuService.uploadMenu(userId, name, price, remark, imagePath);
    return { success: true, data: menu };
  }

  @Post('list')
  async getList(@Body('userId') userId: number): Promise<{ success: boolean; data: Menu[] }> {
    const menus = await this.menuService.getMenusByUserId(userId);
    return { success: true, data: menus };
  }
}