//#region Imports
import { ChannelUserState, Message, Twitch } from "twitch-wrapper-ts";
import config from "./config";
import { readdir } from "fs";
import { ICommand, IParameter, Parameter, VariableType } from "./command";
import { valid } from "sandhands";
//#endregion

// Connect to twitch with parameters defined in config
const channelName = config.username;
const twitch = new Twitch(config.username, config.chatOauth, channelName);

// Listen to connect, and when connected, send message to the channel
twitch.on("connected", () => {
    twitch.send("Connected!!", channelName);
});

const commands: ICommand[] = []; // Commands array - empty by default

// Load every single command from 'commands' folder
// ./ is the root folder
readdir("./dist/commands", (err, files) => {

    // If error occurred throw it as exception
    if (err) {
        throw err;
    }

    // every .ts file under folder should represent a FacileRoute
    files.forEach((name) => {
        // remove the extension from the name
        const normalizedName = name.slice(0, -3); // -3 because .ts is 3 length
        // require path is relative
        const requirePath = `./commands/${normalizedName}`;
        const command = require(requirePath) as ICommand;

        // Push required command to the commands array
        commands.push(command);

        console.log(`Command ${command.displayName} is loaded from ${name}`);

    });
});

//#region Helper Functions

function getCommandSyntax(command: ICommand): string {
    // Join parameters by description
    const paramsJoint = command.parameters.map(
        (param) => param.description).join(", ");
    return `${config.defaultPrefix} ${command.displayName} ${paramsJoint}`;
}

//#endregion

// Listen to messages and print some data about the received message
twitch.on("message", (message: Message, channelState: ChannelUserState) => {

    // Print to the console
    console.log(`${new Date().toTimeString()} ${message.channel}: [${message.displayName}] - ${message.content}`);

    // Loop through commands
    commands.forEach(async (command) => {

        const commandCall = config.defaultPrefix + command.displayName;

        // If message starts with command's displayName, the command is called
        if (message.content.startsWith(commandCall)) {

            // Get the arguments
            // Crop out the name part
            const cropped = message.content.substr(commandCall.length + 1);

            // , is the seperator for arguments
            const args: string[] = cropped.split(",");

            // If there are not enough parameters given, tell that usage is inappropriate.
            if (args.length < command.parameters.length) {
                await twitch.send("Usage: " + getCommandSyntax(command), "implicit1");
            } else {
                // Enough parameters, check for parameter types.

                // Placeholder parameter
                let notValidParameter: IParameter = new Parameter("", String);

                // Check if at least one arg is invalid.
                const notValid = args.some((arg, index) => {
                    // Get the parameter type required by command.
                    const requiredParameter = command.parameters[index];

                    // Set not valid parameter detials.
                    notValidParameter = requiredParameter;
                    return !valid(requiredParameter.type(arg), requiredParameter.type);
                });

                // We have to make it any, so they are the same type.
                const humanReadableTypes = new Map([
                    [String as any, "String"],
                    [Number, "Number"]
                ]);

                // If one argument is not valid, 
                if (notValid) {
                    // Get the human readable type from function.
                    const humanReadableType = humanReadableTypes.get(notValidParameter.type) as string;
                    
                    await twitch.send(`Parameter ${notValidParameter.description} should be a ${humanReadableType}`, message.channel);
                    return;
                }

                command.run(twitch, message, ...args);
            }

        }
    });
});

// This syntax is ugly, but you have to do this in order to do something async
(async () => {
    await twitch.connect();
})();
