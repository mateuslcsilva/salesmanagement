export interface sale {
    saleId: number | undefined,
    numTable: number,
    numSale: number,
    costumerName: string,
    orders: string[],
    date: string,
    time: string,
    closed: boolean,
    paymentMethod: string
}