import React, { useContext, useState } from 'react'
import { sale } from '../../types/sale/sale'

interface SalesContextType {
    sales: Array<sale>,
    setSales: React.Dispatch<React.SetStateAction<Array<sale>>>
}

interface childrenType {
    children : React.ReactNode
}

const SalesContext = React.createContext({} as SalesContextType)

export const useSalesContext = () => {
    return useContext(SalesContext)
}

export const SalesProvider = ({ children }: childrenType) => {

    const [sales, setSales] = useState([] as Array<sale>)

    return (
        <>
            <SalesContext.Provider value={{sales, setSales}}>
                    {children}
            </SalesContext.Provider>
        </>
    )
}