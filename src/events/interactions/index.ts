// src/events/interactionCreate.ts
import { Events, type Client, type Interaction } from 'discord.js';
import chatInputCommandHandler from './handlers/chatInputCommandHandler';
import chatInputAutoCompleteHandler from './handlers/chatInputAutoCompleteHandler';
import studyChannelSelectMenu from './handlers/studyChannelSelectMenuHandler';
import startSelectHandler from './handlers/startSelectHandler';

export default {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction, client: Client) {
    if (
      interaction.isStringSelectMenu() &&
      interaction.guildId &&
      interaction.customId === 'STUDY-CH-SELECT' &&
      interaction.message.interaction?.commandName === 'set-study-channels'
    ) {
      await studyChannelSelectMenu(interaction);
      return;
    }

    if (
      (interaction.isStringSelectMenu() || interaction.isButton()) &&
      interaction.guildId &&
      interaction.message?.interaction?.commandName === 'start'
    ) {
      await startSelectHandler(interaction, client);
      return;
    }

    if (interaction.isChatInputCommand()) {
      await chatInputCommandHandler(interaction);
      return;
    }

    if (interaction.isAutocomplete()) {
      await chatInputAutoCompleteHandler(interaction);
      return;
    }
  },
};
