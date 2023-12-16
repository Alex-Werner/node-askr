class SubscriptionMessage {
    constructor(eventType) {
        this.eventType = eventType;
    }

    toJSON() {
        return {
            type: 'subscription',
            eventType: this.eventType,
        };
    }
}

export default SubscriptionMessage;
