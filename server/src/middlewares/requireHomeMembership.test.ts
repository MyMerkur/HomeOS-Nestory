import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { authenticate } from './authenticate';
import { requireHomeMembership } from './requireHomeMembership';
import { validateParams } from './validate';
import { homeIdParamSchema } from '../validations/paramsValidation';
import { errorHandler } from './errorHandler';
import { Membership } from '../models/Membership';
import { signAccessToken } from '../utils/tokens';
import { sendSuccess } from '../utils/apiResponse';

let mongo: MongoMemoryServer;

function buildTestApp() {
  const app = express();
  app.use(express.json());

  app.get(
    '/homes/:homeId/admin-only',
    authenticate,
    validateParams(homeIdParamSchema),
    requireHomeMembership('admin'),
    (req, res) => sendSuccess(res, { membership: req.membership }),
  );

  app.get(
    '/homes/:homeId/member-only',
    authenticate,
    validateParams(homeIdParamSchema),
    requireHomeMembership('member'),
    (req, res) => sendSuccess(res, { membership: req.membership }),
  );

  app.use(errorHandler);
  return app;
}

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

describe('requireHomeMembership', () => {
  const app = buildTestApp();
  const homeId = new mongoose.Types.ObjectId().toString();

  it('allows an active member with sufficient role', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    await Membership.create({ homeId, userId, role: 'member', status: 'active' });
    const token = signAccessToken(userId);

    const res = await request(app)
      .get(`/homes/${homeId}/member-only`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.membership.role).toBe('member');
  });

  it('rejects a user who is not a member', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const token = signAccessToken(userId);

    const res = await request(app)
      .get(`/homes/${homeId}/member-only`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('NOT_A_MEMBER');
  });

  it('rejects a removed member', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    await Membership.create({ homeId, userId, role: 'member', status: 'removed' });
    const token = signAccessToken(userId);

    const res = await request(app)
      .get(`/homes/${homeId}/member-only`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('NOT_A_MEMBER');
  });

  it('rejects a member with an insufficient role', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    await Membership.create({ homeId, userId, role: 'viewer', status: 'active' });
    const token = signAccessToken(userId);

    const res = await request(app)
      .get(`/homes/${homeId}/admin-only`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('INSUFFICIENT_ROLE');
  });

  it('allows an owner on an admin-only route', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    await Membership.create({ homeId, userId, role: 'owner', status: 'active' });
    const token = signAccessToken(userId);

    const res = await request(app)
      .get(`/homes/${homeId}/admin-only`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});
