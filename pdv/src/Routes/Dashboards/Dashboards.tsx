import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
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

    const getItemText = (numItem :number) => {
        let currentItem = itemList.filter(item => item.numItem == numItem)
        if(currentItem[0]?.itemRef && currentItem[0]?.item) return `${currentItem[0]?.itemRef} - ${currentItem[0]?.item}`
    }
    
    const count = (array :Array<number>, item :number) :any => {
        let appearence = 0
        array.forEach(element => {
            if(element == item) appearence++
        })
        if(getItemText(item)) return {
            element: item,
            appearences: appearence,
            text: getItemText(item)
        } 
    }

    const getTotalSaleValue = () => {
        let totalSaleValue = 0
        sales.forEach(sale => {
            if (Number(sale.date.substring(4, 5)) - 1 == (new Date()).getMonth()) {
                totalSaleValue += sale.totalValue
                console.log("here")
            }
        })
        salesHistory?.forEach(sale => {
            if (Number(sale.date.substring(4, 5)) - 1 == (new Date()).getMonth()) {
                totalSaleValue += sale.totalValue
            }
        })
        return totalSaleValue
    }

    const getNumberOfSales = () => {
        let numberOfSales = 0
        sales.forEach(sale => {
            if (Number(sale.date.substring(4, 5)) - 1 == (new Date()).getMonth()) {
                numberOfSales++
            }
        })
        salesHistory?.forEach(sale => {
            if (Number(sale.date.substring(4, 5)) - 1 == (new Date()).getMonth()) {
                numberOfSales++
            }
        })
        return numberOfSales
    }

    const getMostSelledItem = () => {
        let allSelledItems :Array<number> = []
        sales.forEach(sale => {
            if (Number(sale.date.substring(4, 5)) - 1 == (new Date()).getMonth()) {
                allSelledItems.push(...sale.orders)
            }
        })
        salesHistory?.forEach(sale => {
            if (Number(sale.date.substring(4, 5)) - 1 == (new Date()).getMonth()) {
                allSelledItems.push(...sale.orders)
            }
        })

        let mostSelledItems :Array<{element: number, appearences: number, text: string}> = []
        allSelledItems.forEach(item => {
            if(mostSelledItems && mostSelledItems.find(element1 => element1.element == item)) return false
            if(count(allSelledItems, item)) mostSelledItems.push(count(allSelledItems, item))
        })

        return mostSelledItems.sort((a, b) => b.appearences - a.appearences)
    }

    useEffect(() => {
        getItems()
    }, [AuthContext.currentUser.id])

    useEffect(() => {
        //console.log(sales)
        // console.log(sales[0].date.substring(4,5))
        console.log(getMostSelledItem())
    })

    return (
        <>
            <h1 className='dashboards-title'>
                <i className="bi bi-clipboard-data"></i>
                Dashboards
            </h1>
            <h3 className='section-title'><i className="bi bi-wallet2"></i>Números do mês</h3>
            <p className='section-sub-title'>Seu mês até agora</p>
            <div className='primary-data'>
                <div>
                    <i className="bi bi-cash-stack"></i>
                    <div className='primary-data-info'>
                        <h1>{getTotalSaleValue().toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h1>
                        <p>Valor total vendido</p>
                    </div>
                </div>
                <div>
                    <i className="bi bi-cart-check"></i>
                    <div className='primary-data-info'>
                        <h1>{getNumberOfSales()}</h1>
                        <p>Número de pedidos</p>
                    </div>
                </div>
                <div>
                    <i className="bi bi-cash"></i>
                    <div className='primary-data-info'>
                        <h1>{(getTotalSaleValue()/getNumberOfSales()).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h1>
                        <p>Ticket Médio</p>
                    </div>
                </div>
            </div>
            <h3 className='section-title'><i className="bi bi-graph-up-arrow"></i>Gráficos</h3>
            <p className='section-sub-title'>Análise detalhada das informações do mês</p>
            <div className='charts'>
                <div className='div1'></div>
                <div className='div2'></div>
                <div className='div3'></div>

            </div>
        </>
    )
}