export default function fastCompare(newState) {
    return JSON.stringify(this.state) === JSON.stringify(newState);
}
