export default function toJSON() {
    return {
        type: 'subscription',
        eventType: this.eventType,
    };
}
