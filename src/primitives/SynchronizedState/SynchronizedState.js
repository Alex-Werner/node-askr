/**
 * SynchronizedState is used as a state manager for distributed state.
 * In the context of this project, it is used to manage the state of the peers and their subscriptions.
 * We use a fast compare to ensure that the state is synchronized between peers.
 * And we provide a callback to notify the user of the state change.
 */
import fastCompare from "./methods/fastCompare.js";
import merge from "./methods/merge.js";
import replace from "./methods/replace.js";
import replaceIfNewer from "./methods/replaceIfNewer.js";
import setState from "./methods/setState.js";
import update from "./methods/update.js";


class SynchronizedState {
    /**
     * @param {Object} initialState
     * @param {Function} callback
     */
    constructor(initialState, callback) {
        this.state = initialState;
        this.callback = callback;
    }
}

SynchronizedState.prototype.fastCompare = fastCompare
SynchronizedState.prototype.merge = merge;
SynchronizedState.prototype.replace = replace;
SynchronizedState.prototype.replaceIfNewer = replaceIfNewer;
SynchronizedState.prototype.setState = setState;
SynchronizedState.prototype.update = update;

export default SynchronizedState;
