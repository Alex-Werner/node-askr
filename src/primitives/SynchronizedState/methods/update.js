export default function update(newState) {
    if (!this.fastCompare(newState)) {
        this.setState(newState);
    }
}
