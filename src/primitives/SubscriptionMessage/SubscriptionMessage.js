import toJSON from "./methods/toJSON.js";

class SubscriptionMessage {
    constructor(eventType) {
        this.eventType = eventType;
    }
}

SubscriptionMessage.prototype.toJSON = toJSON;

export default SubscriptionMessage;
