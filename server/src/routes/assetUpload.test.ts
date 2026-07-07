import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../app';
import * as authService from '../services/authService';
import * as homeService from '../services/homeService';
import * as assetService from '../services/assetService';
import { signAccessToken } from '../utils/tokens';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

async function setupHomeWithAsset() {
  const { user } = await authService.register({
    name: 'Owner',
    email: `owner-${Date.now()}-${Math.random()}@example.com`,
    password: 'Min8Chars!',
  });
  const { home } = await homeService.createHome(user.id, { name: 'Test Home' });
  const asset = await assetService.createAsset(home.id, user.id, {
    name: 'Televizyon',
    category: 'Electronics',
  });
  const token = signAccessToken(user.id);
  return { homeId: home.id, assetId: asset.id, token };
}

describe('POST /api/homes/:homeId/assets/:assetId/receipt', () => {
  const app = createApp();
  const uploadedFiles: string[] = [];

  afterAll(() => {
    for (const filePath of uploadedFiles) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  });

  it('uploads an image and sets receiptImageUrl', async () => {
    const { homeId, assetId, token } = await setupHomeWithAsset();

    const res = await request(app)
      .post(`/api/homes/${homeId}/assets/${assetId}/receipt`)
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('fake-image-bytes'), 'receipt.jpg');

    expect(res.status).toBe(200);
    expect(res.body.data.asset.receiptImageUrl).toMatch(/^\/uploads\/receipts\/.+\.jpg$/);

    const filename = res.body.data.asset.receiptImageUrl.split('/').pop();
    const filePath = path.join(__dirname, '../../uploads/receipts', filename);
    uploadedFiles.push(filePath);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('rejects a non-image upload', async () => {
    const { homeId, assetId, token } = await setupHomeWithAsset();

    const res = await request(app)
      .post(`/api/homes/${homeId}/assets/${assetId}/receipt`)
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('not an image'), 'notes.txt');

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('UPLOAD_ERROR');
  });

  it('rejects when no file is provided', async () => {
    const { homeId, assetId, token } = await setupHomeWithAsset();

    const res = await request(app)
      .post(`/api/homes/${homeId}/assets/${assetId}/receipt`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('FILE_REQUIRED');
  });
});
