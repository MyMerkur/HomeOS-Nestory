import request from 'supertest';
import { createApp } from '../app';

describe('GET /api/health', () => {
  it('returns success envelope with status ok', async () => {
    const app = createApp();

    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
  });
});
