import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Logger } from '@components/Log';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription(`Check Osaka's status.`),
  async execute(interaction: CommandInteraction) {
    const botLatency: number = Date.now() - interaction.createdTimestamp;
    const wsLatency: number = Math.round(interaction.client.ws.ping);

    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle('🏓 Pong!')
      .addFields(
        {
          name: "Bot Latency", value: botLatency + "ms", inline: true
        },
        {
          name: "Websocket Latency", value: wsLatency + "ms", inline: true
        }
      );
    return await interaction.reply({ content: '', embeds: [embed] }).catch((err: any) => Logger.error({ type: "PING", err }))
  },
};