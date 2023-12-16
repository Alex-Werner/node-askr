/**
 * SynchronizedState is used as a state manager for distributed state.
 * In the context of this project, it is used to manage the state of the peers and their subscriptions.
 * We use a fast compare to ensure that the state is synchronized between peers.
 * And we provide a callback to notify the user of the state change.
 */


class SynchronizedState {
    /**
     * @param {Object} initialState
     * @param {Function} callback
     */
    constructor(initialState, callback) {
        this.state = initialState;
        this.callback = callback;
    }

    /**
     * @param {Object} newState
     */
    setState(newState) {
        if (this.state !== newState) {
            this.state = newState;
            this.callback(newState);
        }

        return this.state;

    }

    /**
     * @param {Object} newState
     */
    fastCompare(newState) {
        return JSON.stringify(this.state) === JSON.stringify(newState);
    }

    /**
     * @param {Object} newState
     */
    update(newState) {
        if (!this.fastCompare(newState)) {
            this.setState(newState);
        }
    }

    /**
     * @param {Object} newState
     */
    merge(newState) {
        const mergedState = {
            ...this.state,
            ...newState
        };

        this.update(mergedState);
    }

    /**
     * @param {Object} newState
     */
    replace(newState) {
        this.setState(newState);
    }

    /**
     * @param {Object} newState
     */
    replaceIfNewer(newState) {
        if (this.state.timestamp < newState.timestamp) {
            this.setState(newState);
        }
    }
}

export default SynchronizedState;
