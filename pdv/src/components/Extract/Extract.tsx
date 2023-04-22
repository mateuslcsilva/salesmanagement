import React, { useEffect, useState } from 'react'
import './styles.css'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { Accordion } from '../Accordion/Accordion'
import { useItemListContext } from '../../utils/contexts/ItemsProvider'
import { useSalesContext } from '../../utils/contexts/SalesProvider'

export const Extract = () => {
    const [ocuppiedTables, setOcuppiedTables] = useState(0)
    const AuthContext = useAuthContext()  
    const SalesContext = useSalesContext()
    const ItemListContext = useItemListContext()

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
        getOcupiedTables()
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
                                    <Accordion sale={sale} itemList={ItemListContext.itemList} AuthContext={AuthContext} key={Math.floor(Math.random() * 1_000_000_000).toString()} />
                                )
                            })}
                        </div>
            </div>
        </>
    )
}