import React, { useEffect, useState } from 'react'
import './styles.css'
import SaleAccordion from '../../components/SaleAccordion/SaleAccordion'
import { sale } from '../../types/sale/sale'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { useOrderContext } from '../../utils/contexts/OrderContext'
import { doc, getDoc} from 'firebase/firestore'
import { db } from '../../utils/firebase/firebase'
import { itemType } from '../../types/itemType/itemType'

export const Extract = () => {

    const [itemList, setItemList] = useState<itemType[]>([])
    const [currentUserId, setCurrentUserId] = useState<string>()
    const [totalValue, setTotalValue] = useState(0)
    const [ocuppiedTables, setOcuppiedTables] = useState(0)
    const [sales, setSales] = useState([] as sale[])
    const AuthContext = useAuthContext()
    const orderContext = useOrderContext()

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
                tables.push(sale.numTable)
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
            <div className='extract-div' id='div1'>
                <div className='is-flex is-justify-content-space-around'>
                    <p>Qtde Comandas Abertas: {sales.length}</p>
                    <p>Qtde Mesas em uso: {ocuppiedTables}</p>
                </div>

                    <div>
                        {/* fazer <Accordion sale={sales} hiddeButton={true}/> */}
                    </div>
            </div>
        </>
    )
}