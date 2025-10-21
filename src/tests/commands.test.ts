import assert from 'node:assert';
import test, { after, afterEach, before, describe } from 'node:test';
import { createTestClient } from './setup/discordClient';
import createCommandInteraction from './utils/createCommandInteraction';
import { ActionRowBuilder, Client } from 'discord.js';
import connectToTestDb from './setup/dbConnection';
import { disconnectMongo } from '../utils/db/mongo';
import serverService from '../services/serverService';

describe('common commands', async () => {
  const testClient = await createTestClient();

  test('/ping replies with Pong!', async () => {
    await new Promise<void>((resolve, reject) => {
      const reply = async (msg: string) => {
        try {
          assert.strictEqual(msg, 'Pong!');
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      const interaction = createCommandInteraction(
        testClient,
        'chatInputCommand',
        'ping',
        reply
      );

      testClient.emit('interactionCreate', interaction);
    });
  });
});

describe('server config commands', { concurrency: false }, async () => {
  const fakeGuildId = '2309';
  const fakeVoiceChId = '1810';
  let testClient: Client<true>;

  before(async () => {
    await connectToTestDb();
    await serverService.createServer(fakeGuildId);
    testClient = await createTestClient();
  });

  afterEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  after(async () => {
    await testClient.destroy();
    await disconnectMongo();
  });

  test('/set-study-channels replies with channel select menu', async () => {
    const response = await new Promise<{ content: string; components: unknown[] }>(
      (resolve, reject) => {
        const reply = async (msg: { content: string; components: unknown[] }) => {
          try {
            resolve(msg);
          } catch (error) {
            reject(error);
          }
        };

        const interaction = createCommandInteraction(
          testClient,
          'chatInputCommand',
          'set-study-channels',
          reply,
          {
            guildId: fakeGuildId,
            guild: {
              channels: {
                cache: [{ type: 2, name: 'chama', id: fakeVoiceChId }],
              },
            },
          }
        );

        testClient.emit('interactionCreate', interaction);
      }
    );

    assert.ok(response.components[0] instanceof ActionRowBuilder);
    assert.strictEqual(response.components[0].data.type, 1, 'Should be an ActionRow');
  });

  test('/set-study-channels select menu updates study channels', async () => {
    const response = await new Promise<string>((resolve, reject) => {
      const reply = async (msg: string) => {
        try {
          resolve(msg);
        } catch (error) {
          reject(error);
        }
      };

      const interaction = createCommandInteraction(
        testClient,
        'stringSelectMenu',
        'set-study-channels',
        reply,
        {
          guildId: fakeGuildId,
          values: [fakeVoiceChId],
          customId: 'STUDY-CH-SELECT',
          message: {
            interaction: {
              commandName: 'set-study-channels',
            },
            delete: () => undefined,
          },
        }
      );

      testClient.emit('interactionCreate', interaction);
    });

    assert.ok(typeof response === 'string', 'Response should be a string');

    const updatedServer = await serverService.fetchStudyChannels(fakeGuildId);
    assert.strictEqual(updatedServer[0], fakeVoiceChId, 'Study channel should be updated');
  });

  test("/set-report-channel updates server's report channel", async () => {
    const testChannelId = '123';

    const response = await new Promise<string>((resolve, reject) => {
      const reply = async (msg: string) => {
        try {
          resolve(msg);
        } catch (error) {
          reject(error);
        }
      };

      const interaction = createCommandInteraction(
        testClient,
        'chatInputCommand',
        'set-report-channel',
        reply,
        {
          options: {
            getChannel: () => ({ id: testChannelId }),
          },
          guildId: fakeGuildId,
          guild: true,
        }
      );

      testClient.emit('interactionCreate', interaction);
    });

    assert.ok(response.includes(testChannelId), 'Response should mention channel ID');

    await new Promise((resolve) => setTimeout(resolve, 100));

    const server = await serverService.findServer(fakeGuildId);
    assert.strictEqual(server.reportChannel, testChannelId, 'Report channel should be updated');
  });

  test('/list-study-channels displays tracked channels', async () => {
    await serverService.updateServer(fakeGuildId, {
      studyChannels: [fakeVoiceChId],
    });

    const response = await new Promise<string>((resolve, reject) => {
      const reply = async (msg: string) => {
        try {
          resolve(msg);
        } catch (error) {
          reject(error);
        }
      };

      const interaction = createCommandInteraction(
        testClient,
        'chatInputCommand',
        'list-study-channels',
        reply,
        {
          guildId: fakeGuildId,
        }
      );

      testClient.emit('interactionCreate', interaction);
    });

    assert.ok(response.includes(fakeVoiceChId), 'Response should list the study channel');
  });

  test('/set-minimum-time updates minimum session duration', async () => {
    const minDuration = 5;

    const response = await new Promise<string>((resolve, reject) => {
      const reply = async (msg: string) => {
        try {
          resolve(msg);
        } catch (error) {
          reject(error);
        }
      };

      const interaction = createCommandInteraction(
        testClient,
        'chatInputCommand',
        'set-mininum-time',
        reply,
        {
          guildId: fakeGuildId,
          options: {
            getInteger: (name: string) => {
              if (name === 'duration') return minDuration;
              return null;
            },
          },
        }
      );

      testClient.emit('interactionCreate', interaction);
    });

    assert.ok(
      response.includes(`${minDuration} minutes`),
      'Response should confirm the duration'
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    const server = await serverService.findServer(fakeGuildId);
    assert.strictEqual(server.minTime, minDuration * 60, 'minTime should be updated in seconds');
  });

  test('/set-timezone updates server timezone', async () => {
    const timezone = 'America/Sao_Paulo';

    const response = await new Promise<string>((resolve, reject) => {
      const reply = async (msg: string) => {
        try {
          resolve(msg);
        } catch (error) {
          reject(error);
        }
      };

      const interaction = createCommandInteraction(
        testClient,
        'chatInputCommand',
        'set-timezone',
        reply,
        {
          guildId: fakeGuildId,
          options: {
            getString: (name: string) => {
              if (name === 'country') return timezone;
              return null;
            },
          },
        }
      );

      testClient.emit('interactionCreate', interaction);
    });

    assert.ok(response.includes(timezone), 'Response should confirm the timezone');

    await new Promise((resolve) => setTimeout(resolve, 100));

    const server = await serverService.findServer(fakeGuildId);
    assert.strictEqual(server.timezone, timezone, 'Timezone should be updated');
  });

  test('/set-timezone rejects invalid timezone', async () => {
    const invalidTimezone = 'Invalid/Tz';

    const response = await new Promise<string>((resolve, reject) => {
      const reply = async (msg: string | { content: string; flags: string[] }) => {
        try {
          const content = typeof msg === 'string' ? msg : msg.content;
          resolve(content);
        } catch (error) {
          reject(error);
        }
      };

      const interaction = createCommandInteraction(
        testClient,
        'chatInputCommand',
        'set-timezone',
        reply,
        {
          guildId: fakeGuildId,
          options: {
            getString: (name: string) => {
              if (name === 'country') return invalidTimezone;
              return null;
            },
          },
        }
      );

      testClient.emit('interactionCreate', interaction);
    });

    assert.ok(response.includes('Invalid timezone'), 'Should reject invalid timezone');
  });
});
