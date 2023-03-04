export interface sale {
    saleId: number | undefined,
    numTable: number | string,
    numSale: number,
    costumerName: string | undefined,
    orders: (number | undefined)[],
    date: string,
    time: string,
    closed: boolean,
    paymentMethod: string,
    totalValue: number,
    loggedUser: string
}