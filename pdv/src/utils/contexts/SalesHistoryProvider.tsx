import React, { useContext, useEffect, useState } from 'react'
import { sale } from '../../types/sale/sale'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { useAuthContext } from './AuthProvider'

interface SalesHistoryContextType {
    salesHistory: Array<sale>,
    setSalesHistory: React.Dispatch<React.SetStateAction<Array<sale>>>
}

interface childrenType {
    children: React.ReactNode
}

const SalesHistoryContext = React.createContext({} as SalesHistoryContextType)

export const useSalesHistoryContext = () => {
    return useContext(SalesHistoryContext)
}

export const SalesHistoryProvider = ({ children }: childrenType) => {

    const [salesHistory, setSalesHistory] = useState([] as Array<sale>)
    const AuthContext = useAuthContext()

    useEffect(() => {
        console.log("salesContext: ", salesHistory)
        updateSales()
    }, [salesHistory])

    const updateSales = async () => {
          await updateDoc(doc(db, "empresas", AuthContext.currentUser.id), {
            salesHistory: salesHistory
        })
    }

        return (
            <>
                <SalesHistoryContext.Provider value={{ salesHistory, setSalesHistory }}>
                    {children}
                </SalesHistoryContext.Provider>
            </>
        )
}