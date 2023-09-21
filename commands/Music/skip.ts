import { CommandInteraction, GuildMember, EmbedBuilder, SlashCommandBuilder, PermissionsBitField } from "discord.js";
import { bot } from "@bot";
import { canModifyQueue } from "@components/Utils";
import { MusicQueue } from "@components/Queue";

export default {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
    .setName("skip")
    .setDescription("Ah'll skip this song for you.."),
  async execute(interaction: CommandInteraction) {
    const queue: MusicQueue = bot.queues.get(interaction.guild?.id as string) as MusicQueue;

    if (!canModifyQueue({ member: (interaction.member as GuildMember) })) return await interaction.reply({ content: `You are not in my VC!`, ephemeral: true });
    if (!queue) return await interaction.reply({ content: `Ah wasn't gonna sing anyway hmph.`, ephemeral: true });

    queue.player.stop(true);

    const skipEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("Osaka Music")
      .setDescription(`${interaction.user} asked to me stop singing this song \:(.`);

    await interaction.reply({ embeds: [skipEmbed] });
  },
};