import { ActivityType, Client } from "discord.js";
import { bot } from "@bot";
import { Logger } from "@components/Log";

export async function presence({ client }: { client: Client; }): Promise<void> {

    // Switch presences
    let state = Number(0);

    client.on("ready", async (): Promise<void> => {
        Logger.log({ type: "STARTUP", msg: "Music Bot is online." });
        setInterval(() => {
            const presences: [{ type: ActivityType.Watching, message: string }, { type: ActivityType.Watching, message: string }] = [
                { type: ActivityType.Watching, message: `over Alpin's Code` },
                { type: ActivityType.Watching, message: `Azumanga Daioh!` },
            ];
            // Add another status to the array if you want

            state = (state + 1) % presences.length;
            const presence = presences[state];

            client.user?.setActivity(presence.message, { type: presence.type });
        }, 10000);
    });
}