export default function replaceIfNewer(newState) {
    if (this.state.timestamp < newState.timestamp) {
        this.setState(newState);
    }
}
