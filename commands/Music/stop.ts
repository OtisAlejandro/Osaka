import { CommandInteraction, GuildMember, EmbedBuilder, SlashCommandBuilder, PermissionsBitField } from "discord.js";
import { bot } from "@bot";
import { canModifyQueue } from "@components/Utils";
import { MusicQueue } from "@components/Queue";

export default {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
    .setName("stop")
    .setDescription("Tell me to stop singing.."),
  async execute(interaction: CommandInteraction) {
    const queue: MusicQueue = bot.queues.get(interaction.guild?.id as string) as MusicQueue;

    if (!canModifyQueue({ member: interaction.member as GuildMember })) return await interaction.reply({ content: `Geez, you can't kill other people's fun. Join the VC first!`, ephemeral: true });
    if (!queue) return await interaction.reply({ content: `Ah wasn't about to sing...`, ephemeral: true });

    queue.stop();

    const stopEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("Osaka Music")
      .setDescription(`${interaction.user} asked me to stop singing \:(`);

    return await interaction.reply({ embeds: [stopEmbed] });
  },
};