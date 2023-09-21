import { CommandInteraction, GuildMember, EmbedBuilder, SlashCommandBuilder, PermissionsBitField } from "discord.js";
import { bot } from "@bot";
import { canModifyQueue } from "@components/Utils";
import { MusicQueue } from "@components/Queue";

export default {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
    .setName("pause")
    .setDescription("Pause the queue."),
  async execute(interaction: CommandInteraction) {
    const queue: MusicQueue = bot.queues.get(interaction.guild?.id as string) as MusicQueue;

    if (!canModifyQueue({ member: interaction.member as GuildMember })) return await interaction.reply({ content: `There's no music playing right now silly \:D.`, ephemeral: true });
    if (!queue) return await interaction.reply({ content: `You can't just ask me to stop when you're not even there >:(`, ephemeral: true });

    if (queue.player.pause()) {

      const pauseEmbed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("Osaka Music")
        .setDescription(`${interaction.user} paused the song.`);

      await interaction.reply({ embeds: [pauseEmbed] });
      return true;
    }
  },
};