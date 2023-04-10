import React, { useContext, useState } from 'react'
import { sale } from '../../types/sale/sale'

interface SalesHistoryContextType {
    salesHistory: Array<sale>,
    setSalesHistory: React.Dispatch<React.SetStateAction<Array<sale>>>
}

interface childrenType {
    children : React.ReactNode
}

const SalesHistoryContext = React.createContext({} as SalesHistoryContextType)

export const useSalesHistoryContext = () => {
    return useContext(SalesHistoryContext)
}

export const SalesHistoryProvider = ({ children }: childrenType) => {

    const [salesHistory, setSalesHistory] = useState([] as Array<sale>)

    return (
        <>
            <SalesHistoryContext.Provider value={{salesHistory, setSalesHistory}}>
                    {children}
            </SalesHistoryContext.Provider>
        </>
    )
}