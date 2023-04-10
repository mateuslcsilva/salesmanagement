import React, { useContext, useEffect, useState } from 'react'
import { sale } from '../../types/sale/sale'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { useAuthContext } from './AuthProvider'

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
    const AuthContext = useAuthContext()

    useEffect(() => {
        console.log("salesContext: ", sales)
        updateSales()
    }, [sales])

    const updateSales = async () => {
        await updateDoc(doc(db, "empresas", AuthContext.currentUser.id), {
            sales: sales
      })
    }

    return (
        <>
            <SalesContext.Provider value={{sales, setSales}}>
                    {children}
            </SalesContext.Provider>
        </>
    )
}