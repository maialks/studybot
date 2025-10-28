import {
  SectionBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
} from 'discord.js';
import { formatToTimezone } from '../utils/general/date.js';
import { flagMap } from '../config/timezones.js';
import { isToday } from 'date-fns';
import type { Session, ComponentsContainer } from '../types.js';
import type { User as Member } from 'discord.js';

export function buildStudySessionMessage(
  session: Session,
  timezone: string,
  member: Member,
  total: number
): ComponentsContainer {
  const formattedData = {
    start: formatToTimezone(session.start, timezone, 'HH:mm'),
    end: formatToTimezone(session.end, timezone, 'HH:mm'),
    minutes: Math.floor((session.duration % 3600) / 60),
    hours: Math.floor(session.duration / 3600),
    flag: flagMap[timezone] || flagMap['UTC'],
    name: member.username,
    icon: member.displayAvatarURL(),
    id: member.id,
    totalH: Math.floor(total / 3600),
    totalM: Math.floor((total % 3600) / 60),
  };

  const sessionTime =
    formattedData.hours > 0
      ? `${formattedData.hours}h e ${formattedData.minutes}min`
      : `${formattedData.minutes}min`;

  const totalTime =
    formattedData.totalH > 0
      ? `${formattedData.totalH}h${formattedData.totalM ? ` e ${formattedData.totalM}min` : ''}`
      : `${formattedData.totalM}min`;

  const totalLabel = isToday(session.date)
    ? 'Total de Hoje'
    : `Total desde ${formatToTimezone(session.start, timezone, 'MMM dd')}`;

  return [
    new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `## ${formattedData.flag} Sessão Finalizada\n**${formattedData.name}** acabou de concluir uma sessão de estudos!`
        )
      )
      .setThumbnailAccessory((thumb) =>
        thumb.setDescription('User avatar').setURL(formattedData.icon)
      ),
    new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false),
    new ContainerBuilder()
      .setAccentColor(0x212121)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `### ⏱️ Duração da Sessão\nVocê estudou por **${sessionTime}**.`
        )
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `**Início:** ${formattedData.start}\t\t\t**Término:** ${formattedData.end}`
        )
      )
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(2).setDivider(true))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`### 📊 ${totalLabel}\n\n${totalTime}`)
      )
      .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`Parabéns pelo esforço, <@${formattedData.id}>!`)
      ),
  ];
}
