import { DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import { ChatInputCommandInteraction, GuildMember, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, VoiceState, PermissionsBitField } from "discord.js";
import { bot } from "@bot";
import { MusicQueue } from "@components/Queue";
import { Song } from "@components/Song";
import { Logger } from "@components/Log";
import play from "play-dl";

export default {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
    .setName("play")
    .setDescription("Plays audio from YouTube, Spotify or SoundCloud.")
    .addStringOption(option =>
      option
        .setName("query")
        .setDescription("The query to search for.")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const { channel }: VoiceState = (interaction.member as GuildMember).voice;
    const queue: MusicQueue = bot.queues.get(interaction.guild?.id as string) as MusicQueue;
    const url: string = interaction.options.getString("query") as string;

    if (!channel) return await interaction.reply({ content: `You are not currently in a VC.`, ephemeral: true });
    if (queue && channel.id !== queue.connection.joinConfig.channelId) return await interaction.reply({ content: `I am already playing music in another VC!`, ephemeral: true });

    const permissions = channel.permissionsFor(interaction.client?.user);
    const botNoPermissions = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("Osaka Music")
      .setDescription("I am missing permissions to join your channel or speak in your voice channel.");

    if (!permissions?.has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak])) return await interaction.reply({ embeds: [botNoPermissions], ephemeral: true });

    if (play.yt_validate(url) === "playlist" || await play.so_validate(url) === "playlist" || play.sp_validate(url) === "album" || play.sp_validate(url) === "playlist") {
      return bot.commands.get("playlist")?.execute(interaction, url);
    }

    await interaction.reply({ content: "Loading..." });

    let song!: Song;
    try {
      song = await Song.from({ url, search: url, interaction });
    } catch (err: any) {
      interaction.editReply({ content: "An error occured in the music system and the song was not added." });
      return Logger.error({ type: "PLAY", err: err });
    } finally {
      if (queue) {
        queue.songs.push(song);

        const songAdd = new EmbedBuilder()
          .setColor("Blue")
          .setTitle("Osaka Music")
          .setDescription(`**${song.title}** has been added to the queue by ${interaction.user}.`)
          .setThumbnail(song.thumbnail);

        return await interaction.editReply({ content: " ", embeds: [songAdd] }).catch(err => Logger.error({ type: "MUSICCMDS", err }));
      } else {
        await interaction.deleteReply();
      }
    }

    const newQueue = new MusicQueue({
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
    return await newQueue.enqueue({ songs: [song] });
  }
};