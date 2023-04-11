import React, { useEffect, useState } from 'react'
import './styles.css'
import { sale } from '../../types/sale/sale'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { useOrderContext } from '../../utils/contexts/OrderContext'
import { doc, getDoc} from 'firebase/firestore'
import { db } from '../../utils/firebase/firebase'
import { itemType } from '../../types/itemType/itemType'
import { Accordion } from '../Accordion/Accordion'
import { useItemListContext } from '../../utils/contexts/ItemsProvider'
import { useSalesContext } from '../../utils/contexts/SalesProvider'

export const Extract = () => {

    const [currentUserId, setCurrentUserId] = useState<string>()
    const [totalValue, setTotalValue] = useState(0)
    const [ocuppiedTables, setOcuppiedTables] = useState(0)
    const AuthContext = useAuthContext()
    const orderContext = useOrderContext()    
    const SalesContext = useSalesContext()
    const ItemListContext = useItemListContext()

    const getTotalValue = () => {
        let total = 0
        SalesContext.sales.forEach(sale => total += sale.totalValue)
        setTotalValue(total)
    }

    const getOcupiedTables = () => {
        let tables :number[] = []
        SalesContext.sales.forEach(sale => {
            if(typeof sale.numTable == 'number' && !tables.includes(sale.numTable)){
                tables.push(sale.numTable)
            }
        })
        setOcuppiedTables(tables.length)
    }

    useEffect(() => {
        setCurrentUserId(AuthContext.currentUser.id)
    }, [AuthContext.currentUser.id])

    useEffect(() => {
        getOcupiedTables()
        getTotalValue()
    }, [SalesContext.sales])

    return (
        <>
            <div className='extract-div' id='div1'>
                <div className='is-flex is-justify-content-space-around'>
                    <p>Qtde Comandas Abertas: {SalesContext.sales.length}</p>
                    <p>Qtde Mesas em uso: {ocuppiedTables}</p>
                </div>
                        <div>
                            {SalesContext.sales.sort((a, b) => a.numSale - b.numSale).map(sale => {
                                return(
                                    <Accordion sale={sale} itemList={ItemListContext.itemList} AuthContext={AuthContext} />
                                )
                            })}
                        </div>
            </div>
        </>
    )
}