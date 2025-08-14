import serverService from '../services/serverService';
import { expect, test, vi, describe, it, beforeAll, afterAll } from 'vitest';
import env from '../config/env';
import { connectMongo } from '../utils/mongo';
import Server from '../models/serverModel';

describe('database create/delete', () => {
  beforeAll(async () => {
    connectMongo(env.MONGODB_URI);
  });
  it('service can create server document', async () => {
    const res = await serverService.createServer('1350284780666880040');
    expect(res).toBe(true);
  });
  it('service can delete server document', async () => {
    await serverService.deleteServer('1350284780666880040');
    const res = await Server.findOne({ serverId: '1350284780666880040' });
    expect(res).toBeNull();
  });
});
