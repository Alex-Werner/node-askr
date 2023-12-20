import toJSON from "./methods/toJSON.js";
import generateRandomMessageId from "../../utils/generateRandomMessageId.js";

class CommandMessage {
    constructor(command, data, mid) {
        this.mid = mid ?? generateRandomMessageId();
        this.command = command;
        this.data = data;
    }
}

CommandMessage.prototype.toJSON = toJSON;

export default CommandMessage;
