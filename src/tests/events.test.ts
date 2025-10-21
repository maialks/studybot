import test, { describe, after, before, afterEach } from 'node:test';
import assert from 'node:assert';
import {
  DiscordAPIError,
  type DiscordErrorData,
  type Client,
  type Guild,
  type VoiceState,
  Collection,
} from 'discord.js';
import { createTestClient } from './setup/discordClient';
import connectToTestDb from './setup/dbConnection';
import serverService from '../services/serverService';
import { disconnectMongo } from '../utils/db/mongo';
import createVoiceState from './utils/createEvent';
import sessionService from '../services/sessionService';
import userService from '../services/userService';
import { getStartOfDay } from '../utils/general/date';

describe('guild events', { concurrency: false }, async () => {
  before(async () => await connectToTestDb());
  const testClient = await createTestClient();
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
    await testClient.destroy();
  });
});

describe('voice events', { concurrency: false }, async () => {
  let testClient: Client<true>;
  const studyChannels = ['123', 'ABC'],
    reportChannel = 'RPCH',
    serverId = 'SVID';
  let studyingState: VoiceState, notStudyingState: VoiceState;
  before(async () => {
    await connectToTestDb();
    const server = await serverService.createServer(serverId);
    await server.updateOne({ studyChannels, reportChannel });
    testClient = await createTestClient();
    notStudyingState = createVoiceState(testClient, 'MEMBER');
    studyingState = createVoiceState(testClient, 'MEMBER', {
      channelId: studyChannels[0],
    });
  });
  afterEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  test('creates session upon joining a study channel', async () => {
    testClient.emit('voiceStateUpdate', notStudyingState, studyingState);
    await new Promise((r) => setTimeout(r, 100));
    const user = await userService.findUser('MEMBER');
    const session = await sessionService.userSessionExists(user._id);
    assert.ok(!!session);
    await sessionService.deleteOpenSession(user._id);
  });

  test('closes valid session upon leaving channel and sends message component', async () => {
    const user = await userService.findOrCreateUser('MEMBER');
    if (!user) {
      throw new Error('Failed to find/create user');
    }

    const sessionStartTime = new Date(Date.now() - 1_200_000);
    await sessionService.createSessionEntry({
      src: 'discord-bot',
      user: user._id,
      date: getStartOfDay(sessionStartTime),
      start: sessionStartTime,
    });
    const mockReportChannel = {
      send: (message: unknown) => message,
      type: 0, // text channel
    };

    const sentMessage = await new Promise<unknown>((resolve) => {
      const newState = {
        ...notStudyingState,
        guild: {
          ...notStudyingState.guild,
          channels: {
            fetch: () => mockReportChannel,
          },
        },
      } as unknown as VoiceState;

      mockReportChannel.send = (msg: unknown) => {
        resolve(msg);
        return msg;
      };

      testClient.emit('voiceStateUpdate', studyingState, newState);
    });

    assert.ok(sentMessage, 'Message should be sent');
    assert.ok(typeof sentMessage === 'object', 'Message should be an object');
    assert.ok('flags' in sentMessage, 'Message should have flags property');

    const messageWithFlags = sentMessage as { flags: unknown };
    assert.ok(Array.isArray(messageWithFlags.flags), 'Flags should be an array');
    assert.ok(
      messageWithFlags.flags.includes('IsComponentsV2'),
      'Message should use Components V2 format'
    );
  });

  test('sends session closing message to fallback ch when main is invalid', async () => {
    const user = await userService.findOrCreateUser('MEMBER');
    if (!user) throw new Error('Failed to find/create user');

    const sessionStartTime = new Date(Date.now() - 1_200_000); // -20min
    await sessionService.createSessionEntry({
      src: 'discord-bot',
      user: user._id,
      date: getStartOfDay(sessionStartTime),
      start: sessionStartTime,
    });

    const mockChannels = new Collection([
      [
        'logs-id',
        {
          id: 'logs-id',
          type: 0,
          name: 'logs',
          permissionsFor: () => ({ has: () => true }),
          send: function (this: { id: string }, message: unknown) {
            return { targetCh: this.id, message };
          },
        },
      ],
      [
        'random-id',
        {
          id: 'random-id',
          type: 0,
          name: 'random',
          permissionsFor: () => ({ has: () => true }),
          send: function (this: { id: string }, message: unknown) {
            return { targetCh: this.id, message };
          },
        },
      ],
    ]);

    const mockFetchChannel = () => ({
      send: () => {
        throw new DiscordAPIError(
          {} as DiscordErrorData,
          10003, // cod para canal desconhecido
          500,
          'test',
          'http://test.com',
          {}
        );
      },
      type: 0,
    });

    const result = await new Promise<{ targetCh: string; message: unknown }>((resolve) => {
      const newState = {
        ...notStudyingState,
        guild: {
          ...notStudyingState.guild,
          channels: {
            fetch: mockFetchChannel,
            cache: mockChannels,
          },
        },
      } as unknown as VoiceState;

      mockChannels.forEach((channel) => {
        const originalSend = channel.send;
        channel.send = function (message: unknown) {
          const result = originalSend.call(this, message);
          resolve(result);
          return result;
        };
      });

      testClient.emit('voiceStateUpdate', studyingState, newState);
    });

    assert.strictEqual(result.targetCh, 'logs-id', 'Should send to fallback channel "logs"');
    assert.ok(result.message, 'Message should not be empty');
  });

  after(async () => {
    await testClient.destroy();
    await disconnectMongo();
  });
});
