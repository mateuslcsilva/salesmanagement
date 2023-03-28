import { doc, getDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { itemType } from '../../types/itemType/itemType'
import { sale } from '../../types/sale/sale'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { useOrderContext } from '../../utils/contexts/OrderContext'
import { db } from '../../utils/firebase/firebase'
import './styles.css'


export const Sales = () => {
    const AuthContext = useAuthContext()
    const orderContext = useOrderContext()
    const [itemList, setItemList] = useState<Array<itemType>>([])
    const [sales, setSales] = useState<Array<sale>>([] as Array<sale>)
    const [salesHistory, setSalesHistory] = useState<Array<sale>>()

    

    const getItems = async () => {
        if (AuthContext.currentUser.id == '') return false
        let docRef = doc(db, "empresas", `${AuthContext.currentUser.id}`)
        let data = await getDoc(docRef)
            .then(res => {
                setItemList(res.data()?.items)
                setSales(res.data()?.sales)
                setSalesHistory(res.data()?.salesHistory)
            })
    }

    return (
        <>
            <h1 className='sales-title'>
                <i className="bi bi-currency-dollar"></i>
                Vendas
            </h1>
            <h3 className='section-title'><i className="bi bi-wallet2"></i>Números do dia</h3>
            <p className='section-sub-title'>Seu dia até agora</p>
            <div className='primary-sales-data'>
                <div>

                </div>
                <div>

                </div>
                <div>

                </div>
            </div>
            <h3 className='section-title'><i className="bi bi-receipt"></i>Extrato de Vendas</h3>
            <p className='section-sub-title'>Análise detalhada das informações do mês</p>
            <div className='sales'>
                <div className='open-sales'></div>
                <div className='most-salled-item'></div>
            </div>
        </>
    )
}