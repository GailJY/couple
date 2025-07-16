import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './menu.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
  ) {}

  async uploadMenu(
    user_id: number,
    name: string,
    price: number,
    remark: string,
    image_path: string
  ): Promise<Menu> {
    const menu = this.menuRepository.create({ user_id, name, price, remark, image_path });
    return await this.menuRepository.save(menu);
  }

  async getMenusByUserId(userId: number): Promise<Menu[]> {
    return await this.menuRepository.find({ where: { user_id: userId } });
  }
}