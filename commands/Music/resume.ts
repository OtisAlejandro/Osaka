import { EmbedBuilder, CommandInteraction, GuildMember, SlashCommandBuilder, PermissionsBitField } from "discord.js";
import { bot } from "@bot";
import { canModifyQueue } from "@components/Utils";
import { MusicQueue } from "@components/Queue";

export default {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
    .setName("resume")
    .setDescription("Resume the current non-playing track."),
  async execute(interaction: CommandInteraction) {
    const queue: MusicQueue = bot.queues.get(interaction.guild?.id as string) as MusicQueue;

    if (!canModifyQueue({ member: interaction.member as GuildMember })) return await interaction.reply({ content: `I am already playing music in a VC, please join the same channel as me.`, ephemeral: true });
    if (!queue) return interaction.reply({ content: `I am not currently playing any music.`, ephemeral: true });

    if (queue.player.unpause()) {

      const resumeEmbed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("Osaka Music")
        .setDescription(`${interaction.user} resumed the song.`);

      await interaction.reply({ embeds: [resumeEmbed] });
      return true;
    }

    const notPaused = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("Osaka Music")
      .setDescription("The queue is not paused.");

    await interaction.reply({ embeds: [notPaused] });
    return false;
  },
};