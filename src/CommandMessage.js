// Generate a random message id
function generateRandomMessageId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
class CommandMessage {
  constructor(command, data, mid) {
  this.mid = mid ?? generateRandomMessageId();
    this.command = command;
    this.data = data;
  }

  toJSON({workspace = 'askr'}) {
    return {
      workspace,
      mid: this.mid,
      command: this.command,
      data: this.data,
    }
  }
}

export default CommandMessage;
