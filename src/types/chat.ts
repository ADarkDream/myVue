/**
 * 聊天消息
 */
interface ChatMsg {
    roomID: string,
    playerID: string,
    playerName: string,
    message: string,
    type: string,
    status: number,
    time: number
}

/** 
 * 聊天房用户信息
 */
interface PlayerInfo {
    playerID?: string,
    playerName?: string,
    roomID?: string,
    roomName?: string,
    [index: string]: string | undefined
}

export type { ChatMsg, PlayerInfo }
