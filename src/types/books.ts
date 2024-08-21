//账本的类型声明
interface Book {
    bid: number,
    uid?: number,
    name: string,
    intro: null | string,
    status?: number,
    key?: string,
    created_time?: string,
    updated_time?: string,
}

//账单的类型声明
interface Bill {
    id: number,
    bid: number,
    uid: number,
    gid: number,
    // children?: Bill[],
    username: string,
    name: string,
    price: number,
    desc: string,
    type: string,
    status?: number,
    created_time: string,
    updated_time: string,
}

//新增账单的类型声明
interface NewBill {
    bid: number,
    gid: number,
    name: string,
    price: number,
    desc: string,
    type: string,
    status?: number,
}


export {Book, Bill, NewBill}
