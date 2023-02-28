export interface sale {
    saleId: number | undefined,
    numTable: number | undefined,
    numSale: number,
    costumerName: string | undefined,
    orders: string[],
    date: string,
    time: string,
    closed: boolean,
    paymentMethod: string,
    totalValue: number
}