import messageHandler from '../events/message';
import { expect, test, vi } from 'vitest';
import type { Message } from 'discord.js';

test('replies with chama', async () => {
  console.log(messageHandler.execute);
  const fakeReply = vi.fn();
  const fakeMessage = {
    createdTimestamp: 1755021127,
    content: 'teste',
    author: { bot: false, globalName: 'Lucas' },
    reply: fakeReply,
  } as unknown as Message;

  messageHandler.execute(fakeMessage);
  expect(fakeReply).toHaveBeenCalledWith('chama');
});
