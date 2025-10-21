import type { VoiceState, Client, GuildMember, VoiceChannel } from 'discord.js';

const createVoiceState = (
  client: Client<true>,
  memberId: string,
  overrides?: Record<string, unknown>
): VoiceState => {
  const base = {
    client,
    id: memberId,
    guild: {
      id: 'SVID',
      name: 'Test Guild',
    },
    member: {
      id: memberId,
      user: {
        id: memberId,
        username: 'TestUser',
        bot: false,
        displayAvatarURL: () => 'https://example/avatar',
      },
      displayName: 'TestUser',
    } as unknown as GuildMember,
    channelId: null,
    channel: null as VoiceChannel | null,
    deaf: false,
    mute: false,
    selfDeaf: false,
    selfMute: false,
    selfVideo: false,
    serverDeaf: false,
    serverMute: false,
    streaming: false,
    suppress: false,
    sessionId: 'test-session-id',
    setDeaf: async () => ({} as GuildMember),
    setMute: async () => ({} as GuildMember),
    disconnect: async () => ({} as GuildMember),
    setChannel: async () => ({} as GuildMember),
    setSelfDeaf: async () => ({} as GuildMember),
    setSelfMute: async () => ({} as GuildMember),
  };

  return { ...base, ...overrides } as unknown as VoiceState;
};

export default createVoiceState;
