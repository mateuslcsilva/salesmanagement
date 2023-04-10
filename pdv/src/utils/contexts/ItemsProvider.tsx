import React, { useContext, useState } from 'react'
import { itemType } from '../../types/itemType/itemType'

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

    return (
        <>
            <ItemListContext.Provider value={{itemList, setItemList}}>
                    {children}
            </ItemListContext.Provider>
        </>
    )
}