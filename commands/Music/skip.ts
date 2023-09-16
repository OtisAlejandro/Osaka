import { CommandInteraction, GuildMember, EmbedBuilder, SlashCommandBuilder, PermissionsBitField } from "discord.js";
import { bot } from "@bot";
import { canModifyQueue } from "@components/Utils";
import { MusicQueue } from "@components/Queue";

export default {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
    .setName("skip")
    .setDescription("Skip the currently playing song."),
  async execute(interaction: CommandInteraction) {
    const queue: MusicQueue = bot.queues.get(interaction.guild?.id as string) as MusicQueue;

    if (!canModifyQueue({ member: (interaction.member as GuildMember) })) return await interaction.reply({ content: `You are not in my VC!`, ephemeral: true });
    if (!queue) return await interaction.reply({ content: `There are currently no songs to skip in the queue.`, ephemeral: true });

    queue.player.stop(true);

    const skipEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("Osaka Music")
      .setDescription(`${interaction.user} skipped the track.`);

    await interaction.reply({ embeds: [skipEmbed] });
  },
};