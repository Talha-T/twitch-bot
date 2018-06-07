import { Message, Twitch } from "twitch-wrapper-ts";

/**
 * Specifies the type for the command parameter.
 */
enum ParameterType {
    /**
     * Used for decimals with a max precision value of 3.
     */
    Decimal = "[0-9]+(\\.[0-9]{1,3})?",
    /**
     * Used for numbers only. No decimals.
     */
    Number = "\\d+",
    /**
     * Used for strings. Does not match special characters.
     */
    Word = "[A-Za-z\\s]+",
}

/**
 * Defines a parameter for a command.
 */
interface IParameter {
    /**
     * Description of why and what is this command.
     */
    description: string;
    /**
     * Specifies the type of this parameter.
     */
    type: ParameterType;
}

/**
 * Implements IParameter which is used for commands
 */
class Parameter implements IParameter {
    /**
     * Description of why and what is this command.
     */
    public description: string;
    /**
     * Specifies the type of this parameter.
     */
    public type: ParameterType;
    constructor(desc: string, type: ParameterType) {
        this.description = desc;
        this.type = type;
    }
}

/**
 * Defines what a command has.
 */
interface ICommand {
    /**
     * How this command will be called in Twitch chat.
     */
    displayName: string;
    /**
     * The description of this command.
     */
    description: string;
    /**
     * Required parameters for this command.
     */
    parameters: IParameter[];
    /**
     * The main action command will do.
     */
    run: (twitch: Twitch, message: Message, ...args: any[]) => void;
    /**
     * The unique internal ID for the command.
     */
    slug: string;
}

export { ICommand, IParameter, Parameter, ParameterType };
