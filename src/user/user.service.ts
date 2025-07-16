import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import axios from 'axios';

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

  async loginWithWechat(code: string): Promise<User> {
    // 调用微信API获取openid
    const wechatRes = await axios.get('https://api.weixin.qq.com/sns/jscode2session', { 
      params: { 
        appid: process.env.WECHAT_APPID, 
        secret: process.env.WECHAT_SECRET, 
        js_code: code, 
        grant_type: 'authorization_code' 
      } 
    });
    const { openid } = wechatRes.data;

    // 查找或创建用户
    let user = await this.findByOpenid(openid);
    if (!user) {
      user = await this.createUser(openid);
    }
    return user;
  }

  async bindCouple(userId: number, coupleId: number): Promise<void> {
    await this.userRepository.update(userId, { couple_id: coupleId });
    await this.userRepository.update(coupleId, { couple_id: userId });
  }
}