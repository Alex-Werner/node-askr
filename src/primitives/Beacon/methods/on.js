export default function on(type, callback) {
    this.logger.method('.on').log('Setting callback for type ', type)
    this.callbacks[type] = callback;
}
