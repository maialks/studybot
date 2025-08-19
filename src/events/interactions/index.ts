// src/events/interactionCreate.ts
import { Events, type Interaction } from 'discord.js';
import chatInputCommandHandler from './chatInputCommand';
import chatInputAutoCompleteHandler from './chatInputAutoCompleteHandler';
import studyChannelSelectMenu from './studyChannelSelectMenu';

export default {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    // console.log(interaction.isStringSelectMenu());
    if (interaction.isStringSelectMenu())
      await studyChannelSelectMenu(interaction);

    // console.log(interaction.isChatInputCommand());
    if (interaction.isChatInputCommand())
      await chatInputCommandHandler(interaction);

    // console.log(interaction.isAutocomplete());
    if (interaction.isAutocomplete())
      await chatInputAutoCompleteHandler(interaction);
  },
};
