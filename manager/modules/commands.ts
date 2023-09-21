import { ChannelType, Client, InteractionType } from "discord.js";
import { bot } from "@bot";

export async function commands({ client }: { client: Client; }): Promise<void> {
  // When there is an interaction with the bot
  client.on("interactionCreate", async (interaction): Promise<void> => {
    // If it isn't an app command, return.
    if (interaction.type !== InteractionType.ApplicationCommand) return;
    if (!interaction || interaction.user.bot || !interaction.guild || interaction.channel?.type === ChannelType.DM) return;

    const command = bot.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (error: any) {
      console.error(error);
      await interaction.reply({ content: "I dunno what happened... but it didn't work...", ephemeral: true });
    }
  });
}