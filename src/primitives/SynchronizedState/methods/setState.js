export default function setState(newState) {
    if (this.state !== newState) {
        this.state = newState;
        this.callback(newState);
    }

    return this.state;

}
