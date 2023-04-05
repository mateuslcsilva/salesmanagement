import React, { useEffect, useState } from 'react'
import './styles.css'
import { sale } from '../../types/sale/sale'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { useOrderContext } from '../../utils/contexts/OrderContext'
import { doc, getDoc} from 'firebase/firestore'
import { db } from '../../utils/firebase/firebase'
import { itemType } from '../../types/itemType/itemType'
import { Accordion } from '../Accordion/Accordion'

interface propsType {
    sales: Array<sale>,
    itemList: Array<itemType>
}

export const Extract = (props :propsType) => {

    const [currentUserId, setCurrentUserId] = useState<string>()
    const [totalValue, setTotalValue] = useState(0)
    const [ocuppiedTables, setOcuppiedTables] = useState(0)
    const AuthContext = useAuthContext()
    const orderContext = useOrderContext()

    const getTotalValue = () => {
        let total = 0
        props.sales.forEach(sale => total += sale.totalValue)
        setTotalValue(total)
    }

    const getOcupiedTables = () => {
        let tables :number[] = []
        props.sales.forEach(sale => {
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
    }, [props.sales])

    return (
        <>
            <div className='extract-div' id='div1'>
                <div className='is-flex is-justify-content-space-around'>
                    <p>Qtde Comandas Abertas: {props.sales.length}</p>
                    <p>Qtde Mesas em uso: {ocuppiedTables}</p>
                </div>
                        <div>
                            {props.sales.map(sale => {
                                return(
                                    <Accordion sale={sale} itemList={props.itemList} AuthContext={AuthContext} />
                                )
                            })}
                        </div>
            </div>
        </>
    )
}