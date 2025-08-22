import { type SectionBuilder, type ContainerBuilder, type Interaction } from 'discord.js';
import { buildSessionStartMessage } from '../../../builders/startCommandComponents';
import type { ConfigState } from '../../../types';

export function getUpdatedUI(
  interaction: Interaction,
  session: ConfigState
): (SectionBuilder | ContainerBuilder)[] {
  if (!interaction.guild) throw new Error('no guild id');
  const allTextChannels = interaction.guild.channels.cache.filter((ch) => ch.type === 0);

  const args = {
    voiceChannels: interaction.guild.channels.cache.filter((ch) => ch.type === 2),
    defaultStudyChannels: session.data.studyChannels,
    notDefaultTextChannels: allTextChannels.filter((ch) => ch.id !== session.data.reportChannel),
    defaultTextChannel: allTextChannels.get(session.data.reportChannel),
    selectedTime: session.data.minTime,
  };

  return buildSessionStartMessage(args, session.completed);
}
