import { DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import { ChatInputCommandInteraction, GuildMember, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, VoiceState } from "discord.js";
import { bot } from "@bot";
import { Logger } from "@components/Log";
import { MusicQueue } from "@components/Queue";
import { Playlist } from "@components/Playlist";

export default {
  data: new SlashCommandBuilder()
    .setName("playlist")
    .setDescription("Play a YouTube or SoundCloud playlist.")
    .addStringOption(option =>
      option
        .setName("query")
        .setDescription("The URL of the playlist.")
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const { channel }: VoiceState = (interaction.member as GuildMember).voice;
    const queue: MusicQueue = bot.queues.get(interaction.guild?.id as string) as MusicQueue;
    const url = interaction.options.getString("query") as string;

    if (!channel) return interaction.reply({ content: "You are not in a VC.", ephemeral: true });
    if (queue && channel.id !== queue.connection.joinConfig.channelId) return interaction.reply({ content: "I am playing music in another channel already! Please join my channel or wait for me to finish.", ephemeral: true });

    const permissions = channel.permissionsFor(interaction.client?.user);

    if (!permissions?.has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak])) return interaction.reply({ content: "I am missing the permissions to connect or speak in your voice channel.", ephemeral: true });

    interaction.deferReply();
    let playlist!: Playlist;
    try {
      playlist = await Playlist.from({ url, search: url, interaction });
    } catch (err: any) {
      Logger.error({ type: "PLAYLIST", err: err.stack });

      console.log(url);
      return interaction.editReply({ content: "Playlist not found." }).catch(console.error);
    }

    if (queue) {
      queue.songs.push(...playlist.videos);
    } else {
      const newQueue = await new MusicQueue({
        options: {
          interaction,
          connection: joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
          })
        }
      });

      bot.queues.set(interaction.guild?.id as string, newQueue);
      newQueue.songs.push(...playlist.videos);

      await newQueue.enqueue({ songs: [playlist.videos[0]] });
    }

    const playlistEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("Track Player")
      .setDescription("The following playlist has been added to the queue:")
      .addFields(
        {
          name: playlist.data.title ? playlist.data.title : "Spotify Playlist", value: "** **"
        })
      .setURL(playlist.data.url as string);

    if ((playlistEmbed.data.description?.length as number) >= 2048)
      playlistEmbed.data.description =
        playlistEmbed.data.description?.substr(0, 2007) as string;

    return interaction.editReply({ embeds: [playlistEmbed] }).catch((err: any) => Logger.error({ type: "MUSICCMDS", err }));
  },
};