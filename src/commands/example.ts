import { Message, Twitch } from "twitch-wrapper-ts";
import { ICommand, Parameter } from "../command";

const command: ICommand = {
    description: "Example description",
    displayName: "example",
    parameters: [
        new Parameter("param1", String),
        new Parameter("param2", Number)
    ],
    run(twitch: Twitch, message: Message, param1: string, param2: number) {
        // Send to the message's channel,
        twitch.send(`Param1: ${param1}, Param2: ${param2}`, message.channel);
    },
    slug: "example",
};

export = command;
