import { type Client, type Interaction, InteractionType } from 'discord.js';

const createCommandInteraction = (
  client: Client<true>,
  type: 'chatInputCommand' | 'stringSelectMenu' | 'autoComplete' | 'button',
  commandName: string,
  reply: (message: any) => Promise<any>,
  overrides?: Record<string, any>
): Interaction => {
  const base = {
    type: InteractionType.ApplicationCommand,
    commandName,
    client,
    isChatInputCommand: () => type === 'chatInputCommand',
    isStringSelectMenu: () => type === 'stringSelectMenu',
    isAutocomplete: () => type === 'autoComplete',
    isButton: () => type === 'button',
    reply,
    guildId: '2309',
  };

  return { ...base, ...overrides } as Interaction;
};

export default createCommandInteraction;
