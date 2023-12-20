export default function toJSON({workspace = 'askr'}) {
    return {
        workspace,
        mid: this.mid,
        command: this.command,
        data: this.data,
    }
}
