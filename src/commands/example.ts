import { Message, Twitch } from "twitch-wrapper-ts";
import { ICommand, Parameter, ParameterType } from "../command";

const command: ICommand = {
    description: "Example description",
    displayName: "example",
    parameters: [new Parameter("param1", ParameterType.Word),
    new Parameter("param2", ParameterType.Number)],
    run(twitch: Twitch, message: Message, param1: string, param2: number) {
        twitch.send(`Param1: ${param1}, Param2: ${param2}`, "implicit1");
    },
    slug: "example",
};

export = command;
