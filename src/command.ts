import { Message, Twitch } from "twitch-wrapper-ts";

export type VariableType = StringConstructor | BooleanConstructor | NumberConstructor;

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
    type: VariableType;
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
    public type: VariableType;
    constructor(desc: string, type: VariableType) {
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

export { ICommand, IParameter, Parameter };
