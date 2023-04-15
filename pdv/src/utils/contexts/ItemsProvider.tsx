import React, { useContext, useEffect, useState } from 'react'
import { itemType } from '../../types/itemType/itemType'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { useAuthContext } from './AuthProvider'

interface ItemListContextType {
    itemList: Array<itemType>,
    setItemList: React.Dispatch<React.SetStateAction<Array<itemType>>>
}

interface childrenType {
    children : React.ReactNode
}

const ItemListContext = React.createContext({} as ItemListContextType)

export const useItemListContext = () => {
    return useContext(ItemListContext)
}

export const ItemListProvider = ({ children }: childrenType) => {

    const [itemList, setItemList] = useState([] as Array<itemType>)
    const AuthContext = useAuthContext()

    useEffect(() => {
        if(!AuthContext.currentUser.id) return
        updateSales()
    }, [itemList])

    const updateSales = async () => {
          await updateDoc(doc(db, "empresas", AuthContext.currentUser.id), {
            items: itemList
        })
    }

    return (
        <>
            <ItemListContext.Provider value={{itemList, setItemList}}>
                    {children}
            </ItemListContext.Provider>
        </>
    )
}