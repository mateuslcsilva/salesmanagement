import React, { createContext, useContext, useState } from 'react'

interface childrenType {
    children: React.ReactNode
}

interface OrderContextData {
    currentOrder: number | undefined,
    setCurrentOrder: React.Dispatch<React.SetStateAction<number>>
}

export const OrderContext = createContext({} as OrderContextData)

export const useOrderContext = () => {
    return useContext(OrderContext)
}

export const OrderProvider = ({ children }: childrenType) => {

    
    const [currentOrder, setCurrentOrder] = useState<number>(0)

    return (
        <>
            <OrderContext.Provider value={{ currentOrder, setCurrentOrder }}>
                {children}
            </OrderContext.Provider>
        </>
    )
}