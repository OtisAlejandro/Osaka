import { Client, Collection, Snowflake } from "discord.js";
import { Command } from "@common/types";
import { config } from "@components/config";
import { Manager } from '@manager';
import { MusicQueue } from '@components/Queue';
import play from 'play-dl';

export class Bot {
  public commands: Collection<Snowflake, Command> = new Collection<Snowflake, Command>();
  public queues: Collection<Snowflake, MusicQueue> = new Collection<Snowflake, MusicQueue>();
  public readonly token: string = config.TOKEN;
  debug: any;
  
  public constructor(private client: Client) {
    this.client.login(this.token);
    play.setToken({
      soundcloud: {
        client_id: config.SOUNDCLOUD_CLIENT_ID
      },
      spotify: {
        client_id: config.SPOTIFY_CLIENT_ID,
        client_secret: config.SPOTIFY_SECRET_ID,
        market: "us",
        refresh_token: config.SPOTIFY_REFRESH_TOKEN,
      }
    });

    new Manager({ client });
  }
}