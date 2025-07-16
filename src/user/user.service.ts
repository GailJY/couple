import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(openid: string): Promise<User> {
    const user = this.userRepository.create({ openid });
    return await this.userRepository.save(user);
  }

  async findByOpenid(openid: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ openid });
  }

  async bindCouple(userId: number, coupleId: number): Promise<void> {
    await this.userRepository.update(userId, { couple_id: coupleId });
    await this.userRepository.update(coupleId, { couple_id: userId });
  }
}