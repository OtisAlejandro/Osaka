import { CommandInteraction, GuildMember, EmbedBuilder, SlashCommandBuilder, PermissionsBitField } from "discord.js";
import { bot } from "@bot";
import { canModifyQueue } from "@components/Utils";
import { MusicQueue } from "@components/Queue";

export default {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
    .setName("stop")
    .setDescription("Stop the queue."),
  async execute(interaction: CommandInteraction) {
    const queue: MusicQueue = bot.queues.get(interaction.guild?.id as string) as MusicQueue;

    if (!canModifyQueue({ member: interaction.member as GuildMember })) return await interaction.reply({ content: `I am already playing music in a VC, please join the same channel as me.`, ephemeral: true });
    if (!queue) return await interaction.reply({ content: `There is not currently anything playing in the queue.`, ephemeral: true });

    queue.stop();

    const stopEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("Osaka Music")
      .setDescription(`${interaction.user} stopped the queue.`);

    return await interaction.reply({ embeds: [stopEmbed] });
  },
};