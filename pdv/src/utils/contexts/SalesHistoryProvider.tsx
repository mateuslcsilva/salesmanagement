import React, { useContext, useEffect, useState } from 'react'
import { sale } from '../../types/sale/sale'
import { doc, updateDoc } from 'firebase/firestore'
import { db, DOC_PATH } from '../firebase/firebase'
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
        if(!AuthContext.currentUser.id) return
        updateSales()
    }, [salesHistory])

    const updateSales = async () => {
          await updateDoc(doc(db, DOC_PATH, AuthContext.currentUser.id), {
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