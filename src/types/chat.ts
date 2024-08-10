interface ChatMsg {
    roomID: string,
    playerID: string,
    playerName: string,
    message: string,
    type: string,
    status: number,
    time: number
}


export {ChatMsg}
