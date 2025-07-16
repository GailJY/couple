import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/user/create (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/user/create')
      .send({ openid: 'test_openid' });
    expect(res.status).toBe(201);
    expect(res.body.data.openid).toBe('test_openid');
  });

  it('/user/bind (POST)', async () => {
    const user1 = await request(app.getHttpServer()).post('/user/create').send({ openid: 'user1' });
    const user2 = await request(app.getHttpServer()).post('/user/create').send({ openid: 'user2' });
    const res = await request(app.getHttpServer())
      .post('/user/bind')
      .send({ userId: user1.body.data.id, coupleId: user2.body.data.id });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
})