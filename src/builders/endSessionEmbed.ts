import { formatToTimezone } from '../utils/date';
import { EmbedBuilder } from 'discord.js';
import { flagMap } from '../config/timezones';
import { isToday } from 'date-fns';

import type { Session } from '../types';
import type { User as Member } from 'discord.js';

const buildEmbed = function (
  session: Session,
  timezone: string,
  member: Member,
  total: number
): EmbedBuilder {
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

  const embed = new EmbedBuilder()
    .setAuthor({
      name: `${formattedData.name} ${formattedData.flag}`,
      iconURL: formattedData.icon,
    })
    .setDescription(`<@${formattedData.id}>`)
    .setColor('#f54336')
    .addFields(
      {
        name: `Parabéns! Você estudou por ${
          formattedData.hours
            ? `${formattedData.hours}h e ${formattedData.minutes}min`
            : `${formattedData.minutes}min`
        }`,
        value: '\u200B',
      },
      { name: 'De:', value: formattedData.start, inline: true },
      { name: 'Até:', value: formattedData.end, inline: true }
    )
    .setFooter({
      text: `Total ${
        isToday(session.date)
          ? 'de Hoje:'
          : `${formatToTimezone(
              session.start,
              timezone,
              'MMM dd'
            )} (início da sessão):`
      } ${
        formattedData.totalH
          ? `${formattedData.totalH}h e ${formattedData.totalM}min`
          : `${formattedData.totalM}min`
      }`,
      iconURL: 'https://i.imgur.com/bwkB5DN.png',
    });
  return embed;
};

export default buildEmbed;
