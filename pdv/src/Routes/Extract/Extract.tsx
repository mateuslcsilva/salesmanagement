import React, { useEffect, useState } from 'react'
import './styles.css'
import Button from '../../components/Button/Button'
import ItemsListInput from '../../components/ItemsListInput/ItemsListInput'
import { Accordion, Alert, TextField } from '@mui/material'
import SaleAccordion from '../../components/SaleAccordion/SaleAccordion'
import { sale } from '../../types/sale/sale'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { useOrderContext } from '../../utils/contexts/OrderContext'
import { doc, getDoc} from 'firebase/firestore'
import { db } from '../../utils/firebase/firebase'

export const Extract = () => {

    const [itemList, setItemList] = useState<itemType[]>([])
    const [currentUserId, setCurrentUserId] = useState<string>()
    const [totalValue, setTotalValue] = useState(0)
    const [ocuppiedTables, setOcuppiedTables] = useState(0)
    const [sales, setSales] = useState([] as sale[])
    const AuthContext = useAuthContext()
    const orderContext = useOrderContext()

    interface itemType {
        numItem: number;
        item: string;
        itemValue: string
    }

    const getItems = async () => {
        if (AuthContext.currentUser.id == '') return false
        let docRef = doc(db, "empresas", `${AuthContext.currentUser.id}`)
        let data = await getDoc(docRef)
            .then(res => {
                setItemList(res.data()?.items)
                setSales(res.data()?.sales)
            })
    }

    const getTotalValue = () => {
        let total = 0
        sales.forEach(sale => total += sale.totalValue)
        setTotalValue(total)
    }

    const getOcupiedTables = () => {
        let tables :number[] = []
        sales.forEach(sale => {
            if(typeof sale.numTable == 'number' && !tables.includes(sale.numTable)){
                console.log(sale.numTable)
                tables.push(sale.numTable)
                console.log(tables)
            }
        })
        setOcuppiedTables(tables.length)
    }

    useEffect(() => {
        setCurrentUserId(AuthContext.currentUser.id)
    }, [AuthContext.currentUser.id])

    useEffect(() => {
        getItems()
    }, [])

    useEffect(() => {
        getOcupiedTables()
        getTotalValue()
    }, [sales])

    return (
        <>
            <div className='div' id='div1'>
                <div className='is-flex is-justify-content-space-around'>
                    <h2 className='title is-5'>Total Valor Aberto: {totalValue.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</h2>
                    <h2 className='title is-5'>Qtde Comandas Abertas: {sales.length}</h2>
                    <h2 className='title is-5'>Qtde Mesas em uso: {ocuppiedTables}</h2>
                </div>

                    <div>
                        <SaleAccordion sale={sales} hiddeButton={true}/>
                    </div>
            </div>
        </>
    )
}