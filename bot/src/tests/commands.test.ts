import assert from 'node:assert';
import test, { describe } from 'node:test';
import { createTestClient } from './setup/discordClient';
import createCommandInteraction from './utils/createCommandInteraction';
// import connectToTestDb from './setup/dbConnection';

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

// describe('server config commands', async () => {
//   const testClient = await createTestClient();

//   test('/set-sutudy-channels', async () => {
//     const res = await new Promise((resolve, reject) => {
//       const reply = async (msg: string) => {
//         try {
//           resolve(msg);
//         } catch (error) {
//           reject(error);
//         }
//       };
//       const interaction = createCommandInteraction(
//         testClient,
//         'stringSelectMenu',
//         'set-study-channels',
//         reply,
//         {
//           message: { interaction: { commandName: 'set-study-channels' } },
//           customId: 'STUDY-CH-SELECT',
//         }
//       );
//       testClient.emit('interactionCreate', interaction);
//     });
//     console.log(res);
//   });
// });
