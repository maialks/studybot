import {
  type SectionBuilder,
  type ContainerBuilder,
  type Interaction,
  type Client,
  type Collection,
  type VoiceChannel,
  type TextChannel,
} from 'discord.js';
import { buildSessionStartMessage } from '../../../builders/startCommandComponents';
import type { ConfigState } from '../../../types';

export function getUpdatedUI(
  client: Client,
  interaction: Interaction,
  session: ConfigState
): (SectionBuilder | ContainerBuilder)[] {
  if (!interaction.guild || !client.user) throw new Error('no guild id or client user');

  const clientUser = client.user;

  const validTextChannels = interaction.guild.channels.cache.filter(
    (ch) => ch.type === 0 && ch.permissionsFor(clientUser)?.has('SendMessages')
  ) as Collection<string, TextChannel>;

  const validVoiceChannels = interaction.guild.channels.cache.filter(
    (ch) => ch.permissionsFor(clientUser)?.has('ViewChannel') && ch.type === 2
  ) as Collection<string, VoiceChannel>;

  const args = {
    voiceChannels: validVoiceChannels,
    defaultStudyChannels: session.data.studyChannels,
    notDefaultTextChannels: validTextChannels.filter(
      (ch) => ch.id !== session.data.reportChannel
    ),
    defaultTextChannel: validTextChannels.get(session.data.reportChannel),
    selectedTime: session.data.minTime,
  };

  return buildSessionStartMessage(args, session.completed);
}
