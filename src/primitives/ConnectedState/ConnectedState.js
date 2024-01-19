import Logger from "hermodlog";

/**
 * This is a class that manage the local node state with ability for read/write from other nodes
 * Such is perform with a cryptographically signed message verification
 * Without such, it is just a simple state manager
 */
class ConnectedState {
    constructor(props = {}) {
        this.logger = props.logger || new Logger().context('[ConnectedState]');
        this.state = new Map(props.state) || new Map();
        this.askr = props.askr;
        // this.state.on('update', (payload)=>{
        //     this.logger.method('constructor').log(`State updated ${payload}`);
        //     this.askr.emit('state-update', payload);
        // });
        // this.askr.on('state-update', (payload)=>{
        //     this.logger.method('constructor').log(`Received state update ${payload}`);
        //     this.state.update(payload);
        // });
    }

    set(key, value){
        this.state.set(key, value);
    }

    get(key){
        return this.state.get(key);
    }

    remove(key){
        this.state.remove(key);
    }

    getState(){
        return this.state;
    }

}

export default ConnectedState;
