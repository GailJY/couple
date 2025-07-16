import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('MenuController (e2e)', () => {
  let app: INestApplication;
  let testUserId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    // 创建测试用户
    const userRes = await request(app.getHttpServer()).post('/user/create').send({ openid: 'menu_test_user' });
    testUserId = userRes.body.data.id;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/menu/upload (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/menu/upload')
      .send({
        userId: testUserId,
        name: '测试菜品',
        price: 15.99,
        remark: '微辣',
        imagePath: '/uploads/test.jpg'
      });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('测试菜品');
  });

  it('/menu/list (POST)', async () => {
    // 先上传一个菜单
    await request(app.getHttpServer()).post('/menu/upload').send({
      userId: testUserId,
      name: '测试菜品',
      price: 15.99,
      remark: '微辣',
      imagePath: '/uploads/test.jpg'
    });
    // 查询菜单列表
    const res = await request(app.getHttpServer()).post('/menu/list').send({ userId: testUserId });
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toBe('测试菜品');
  });
})