//#region Imports
import { Message, Twitch, ChannelUserState } from "twitch-wrapper-ts";
import config from "./config";
//#endregion

// Connect to twitch with parameters defined in config
const channelName = config.username;
const twitch = new Twitch(config.username, config.chatOauth, channelName);

// Listen to connect, and when connected, send message to the channel
twitch.on("connected", () => {
    twitch.send("Connected!!", channelName);
});

// Listen to messages and print some data about the received message
twitch.on("message", (message: Message, channelState: ChannelUserState) => {
    console.log(`${message.channel}: [${message.displayName}] ${message.content}`);
});

// This syntax is ugly, but you have to do this in order to do something async
(async () => {
    await twitch.connect();
})();
