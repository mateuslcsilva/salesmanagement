import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { Extract } from '../../components/Extract/Extract'
import './styles.css'
import {
    Chart as ChartJS, 
    ArcElement, 
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useItemListContext } from '../../utils/contexts/ItemsProvider'
import { useSalesHistoryContext } from '../../utils/contexts/SalesHistoryProvider'
import { useSalesContext } from '../../utils/contexts/SalesProvider'

ChartJS.register(ArcElement,   
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController);

ChartJS.overrides["pie"].plugins.legend.display = false

export const Sales = () => {
    const AuthContext = useAuthContext()
    const SalesContext = useSalesContext()
    const SalesHistoryContext = useSalesHistoryContext()
    const ItemListContext = useItemListContext()
    const [hiddenInfo, setHiddenInfo] = useState<Array<string>>([])

    const getItemText = (numItem: number) => {
        let currentItem = ItemListContext.itemList.filter(item => item.numItem == numItem)
        if (currentItem[0]?.itemRef && currentItem[0]?.item) return `${currentItem[0]?.itemRef} - ${currentItem[0]?.item}`
    }

    const count = (array: Array<number>, item: number): any => {
        let appearence = 0
        array.forEach(element => {
            if (element == item) appearence++
        })
        if (getItemText(item)) return {
            element: item,
            appearences: appearence,
            text: getItemText(item)
        }
    }

    const getTotalSaleValue = () => {
        let totalSaleValue = 0
        SalesContext.sales.forEach(sale => {
            if (Number(sale.date.substring(4, 5)) - 1 == (new Date()).getMonth() && Number(sale.date.substring(0, 2)) == (new Date()).getDate()) {
                totalSaleValue += sale.totalValue
            }
        })
        SalesHistoryContext.salesHistory?.forEach(sale => {
            if (Number(sale.date.substring(4, 5)) - 1 == (new Date()).getMonth() && Number(sale.date.substring(0, 2)) == (new Date()).getDate()) {
                totalSaleValue += sale.totalValue
            }
        })
        return totalSaleValue
    }

    const getNumberOfSales = () => {
        let numberOfSales = 0
        SalesContext.sales.forEach(sale => {
            if (Number(sale.date.substring(4, 5)) - 1 == (new Date()).getMonth() && Number(sale.date.substring(0, 2)) == (new Date()).getDate()) {
                numberOfSales++
            }
        })
        SalesHistoryContext.salesHistory?.forEach(sale => {
            if (Number(sale.date.substring(4, 5)) - 1 == (new Date()).getMonth() && Number(sale.date.substring(0, 2)) == (new Date()).getDate()) {
                numberOfSales++
            }
        })
        return numberOfSales
    }

    const getMostSelledItem = () => {
        let allSelledItems: Array<number> = []
        SalesContext.sales.forEach(sale => {
            if (Number(sale.date.substring(4, 5)) - 1 == (new Date()).getMonth() && Number(sale.date.substring(0, 2)) == (new Date()).getDate()) {
                allSelledItems.push(...sale.orders)
            }
        })
        SalesHistoryContext.salesHistory?.forEach(sale => {
            if (Number(sale.date.substring(4, 5)) - 1 == (new Date()).getMonth() && Number(sale.date.substring(0, 2)) == (new Date()).getDate()) {
                allSelledItems.push(...sale.orders)
            }
        })

        let mostSelledItems: Array<{ element: number, appearences: number, text: string }> = []
        allSelledItems.forEach(item => {
            if (mostSelledItems && mostSelledItems.find(element1 => element1.element == item)) return false
            if (count(allSelledItems, item)) mostSelledItems.push(count(allSelledItems, item))
        })
        console.log(mostSelledItems.sort((a, b) => b.appearences - a.appearences))
        return mostSelledItems.sort((a, b) => b.appearences - a.appearences)
    }

    const getTotalValue = () => {
        let totalValue = 0
        SalesContext.sales.forEach(sale => totalValue += sale.totalValue)
        return totalValue
    }
    
    const toggleHiddenInfo = (info :string) => {
        if(hiddenInfo.includes(info)){
            return setHiddenInfo((hiddenInfo) => hiddenInfo.filter(text => text != info))
        }
        setHiddenInfo(hiddenInfo => [...hiddenInfo, info])
    }

    const backgroundColor = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
    ]

    const borderColor = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
    ]

    const data = {
        labels: getMostSelledItem().map(element => element.text).splice(0, 5),
        outerWidth: 500,
        datasets: [
            {
                label: 'Vendidos: ',
                fill: 1,
                rotation: 25,
                data: getMostSelledItem().map(element => element.appearences).splice(0, 5),
                backgroundColor: document.querySelector('.main')?.classList.contains('darkThemed') ? borderColor : backgroundColor,
                borderColor: backgroundColor,
                borderWidth: 1,
                cutout: 70,
                weight: 200
            },
        ],
    };

    return (
        <>
            <h1 className='sales-title'>
                <i className="bi bi-currency-dollar"></i>
                Vendas
            </h1>
            <h3 className='section-title'><i className="bi bi-wallet2"></i>Números do dia</h3>
            <p className='section-sub-title'>Seu dia até agora</p>
            <div  className={AuthContext.currentUser.userType == "Padrão" ? 'primary-sales-data hidden-info' : 'primary-sales-data'}>
                <div>
                <i className="bi bi-cash-stack"></i>
                    <div className={getTotalSaleValue() > 9999 ? "primary-data-info small-font-size" : "primary-data-info"}>
                        <h1 
                        className={hiddenInfo.includes("totalValue") ? 'info hidden-info' : 'info'}
                        onClick={() => toggleHiddenInfo("totalValue")}
                        >{hiddenInfo.includes("totalValue") ? "R$****" : getTotalSaleValue().toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h1>
                        <p>Valor total vendido</p>
                    </div>
                </div>
                <div> 
                <i className="bi bi-cart-check"></i>
                    <div className='primary-data-info'>
                    <h1
                        className={hiddenInfo.includes("numberOfSales") ? 'info hidden-info' : 'info'}
                        onClick={() => toggleHiddenInfo("numberOfSales")}
                        >
                            {hiddenInfo.includes("numberOfSales") ? "--" : getNumberOfSales()}
                        </h1>
                        <p>Número de pedidos</p>
                    </div>
                </div>
                <div>
                <i className="bi bi-cash"></i>
                    <div className='primary-data-info'>
                        <h1
                            className={hiddenInfo.includes("ticket") ? 'info hidden-info' : 'info'}
                            onClick={() => toggleHiddenInfo("ticket")}
                        >
                            {hiddenInfo.includes("ticket") ? "R$****" : getTotalValue().toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                        </h1>
                        <p>Valor em aberto</p>
                    </div>
                </div>
            </div>
            <h3 className='section-title'><i className="bi bi-receipt"></i>Extrato de Vendas</h3>
            <p className='section-sub-title'>Análise detalhada das informações do mês</p>
            <div  className={AuthContext.currentUser.userType == "Padrão" ? 'sales hidden-info' : 'sales'}>
                <div className='open-sales'>
                    <Extract /> 
                </div>
                <div className='most-salled-item'>
                <Pie data={data} className='pie-chart' />
                    <div className='pie-chart-legends'>

                        {getMostSelledItem().map(element => element.text).splice(0, 5).map((item, index) => {
                            return (
                                <p id='pie-chart-legend'><span style={{ "backgroundColor": document.querySelector('.main')?.classList.contains('darkThemed') ? borderColor[index] : backgroundColor[index], "border": `1px solid ${borderColor[index]}` }}></span>{item}</p>
                            )
                        })}
                    </div>
                    <p>Itens mais vendidos</p>
                </div>
            </div>
        </> 
    )
}