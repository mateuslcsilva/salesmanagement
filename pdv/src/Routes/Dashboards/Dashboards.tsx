import { doc, getDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { itemType } from '../../types/itemType/itemType'
import { sale } from '../../types/sale/sale'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { useOrderContext } from '../../utils/contexts/OrderContext'
import { db } from '../../utils/firebase/firebase'
import './styles.css'


export const Dashboards = () => {
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
            <h1 className='dashboards-title'>
                <i className="bi bi-clipboard-data"></i>
                Dashboards
            </h1>
            <div className='primary-data'>
                <div>

                </div>
                <div>

                </div>
                <div>

                </div>
            </div>
        </>
    )
}