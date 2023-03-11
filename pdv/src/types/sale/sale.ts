export interface sale {
    numTable: number | string,
    numSale: number,
    costumerName: string | undefined,
    orders: number[],
    date: string,
    time: string,
    paymentMethod: string | undefined,
    totalValue: number,
    loggedUser: string
}