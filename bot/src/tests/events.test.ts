import test, { describe, after } from 'node:test';
import assert from 'node:assert';
import type { Guild } from 'discord.js';
import { createTestClient } from './setup/discordClient';
import connectToTestDb from './setup/dbConnection';
import serverService from '../services/serverService';
import { disconnectMongo } from '../utils/db/mongo';

describe('guild events', async () => {
  const testClient = await createTestClient();
  await connectToTestDb();
  const fakeId = '123456789';
  test('guild entry created on guildCreate event', async () => {
    testClient.emit('guildCreate', {
      id: fakeId,
      systemChannel: null,
    } as unknown as Guild);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const newServer = await serverService.findServer(fakeId);
    assert.strictEqual(newServer.serverId, fakeId);
  });

  test('guild entry deleted on guildDelete event', async () => {
    testClient.emit('guildDelete', {
      id: fakeId,
      systemChannel: null,
    } as unknown as Guild);
    await new Promise((r) => setTimeout(r, 100));
    await assert.rejects(() => serverService.findServer(fakeId), /server not found/);
  });

  after(async () => {
    await disconnectMongo();
    testClient.destroy();
  });
});
