export default function   merge(newState) {
    const mergedState = {
        ...this.state,
        ...newState
    };

    this.update(mergedState);
}

