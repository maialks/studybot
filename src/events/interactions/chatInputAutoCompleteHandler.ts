import type { AutocompleteInteraction } from 'discord.js';
import timezones from '../../config/timezones';

export default async function chatInputAutoCompleteHandler(
  interaction: AutocompleteInteraction
) {
  if (interaction.commandName === 'set-timezone') {
    const focusedValue = interaction.options.getFocused();
    const results = timezones
      .filter((timezone) =>
        timezone.name
          .toLowerCase()
          .replace(/[^a-z\s]+/g, '')
          .trim()
          .startsWith(focusedValue.toLowerCase())
      )
      .slice(0, 5);
    interaction.respond(results);
  }
}
