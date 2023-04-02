import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { itemType } from '../../types/itemType/itemType'
import { sale } from '../../types/sale/sale'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { useOrderContext } from '../../utils/contexts/OrderContext'
import { db } from '../../utils/firebase/firebase'
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
    ChartOptions,
} from 'chart.js';
import { Pie, Chart } from 'react-chartjs-2';
import './styles.css'
import { months } from '../../utils/consts'

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

    const getItemText = (numItem: number) => {
        let currentItem = itemList.filter(item => item.numItem == numItem)
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
        let allSelledItems: Array<number> = []
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

        let mostSelledItems: Array<{ element: number, appearences: number, text: string }> = []
        allSelledItems.forEach(item => {
            if (mostSelledItems && mostSelledItems.find(element1 => element1.element == item)) return false
            if (count(allSelledItems, item)) mostSelledItems.push(count(allSelledItems, item))
        })
        console.log(mostSelledItems.sort((a, b) => b.appearences - a.appearences))
        return mostSelledItems.sort((a, b) => b.appearences - a.appearences)
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
                backgroundColor: backgroundColor,
                borderColor: backgroundColor,
                borderWidth: 1,
            },
        ],
    };

    const dataSalesOfMonth = {
        labels : ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"],
        datasets: [
          {
            type: 'line' as const,
            label: 'Quantidade de Vendas',
            borderColor: '#191919',
            borderWidth: 1,
            fill: false,
            data: [75, 82, 144, 86, 159],
          },
          {
            type: 'bar' as const,
            label: 'Valor total',
            backgroundColor: '#3488ceab',
            data: [1200, 1596, 1320, 1586, 1326],
            borderColor: '#3488ce',
            borderWidth: 2,
          }
        ]
      }

      const dataSalesOfYear = {
        labels : months,
        datasets: [
          {
            type: 'line' as const,
            label: 'Quantidade de Vendas',
            borderColor: '#191919',
            borderWidth: 1,
            fill: false,
            data: [75, 82, 144, 86, 159],
          },
          {
            type: 'bar' as const,
            label: 'Valor total',
            backgroundColor: '#3488ceab',
            data: [1200, 1596, 1320, 1586, 1326],
            borderColor: '#3488ce',
            borderWidth: 2,
          }
        ]
      }
      const option :ChartOptions = {
        plugins:{
            legend:{
                position: "right"
            }
        }
      }

    useEffect(() => {
        getItems()
    }, [AuthContext.currentUser.id])

    useEffect(() => {
        console.log()
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
                    <div className={getTotalSaleValue() > 9999 ? "primary-data-info small-font-size" : "primary-data-info"}>
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
                        <h1>{(getTotalSaleValue() / getNumberOfSales()).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h1>
                        <p>Ticket Médio</p>
                    </div>
                </div>
            </div>
            <h3 className='section-title'><i className="bi bi-graph-up-arrow"></i>Gráficos</h3>
            <p className='section-sub-title'>Análise detalhada das informações do mês</p>
            <div className='charts'>
                <div className='div1'>
                    <h1>Resultados Mensal</h1>
                <Chart type='bar' data={dataSalesOfMonth} className='bar-chart' />
                </div>
                <div className='div2'>
                <h1>Resultados Anual</h1>
                <Chart type='bar' data={dataSalesOfYear} className='bar-chart' />
                </div>
                <div className='div3'>
                    <Pie data={data} className='pie-chart' />
                    <div className='pie-chart-legends'>

                        {getMostSelledItem().map(element => element.text).splice(0, 5).map((item, index) => {
                            return (
                                <p id='pie-chart-legend'><span style={{ "backgroundColor": backgroundColor[index], "border": `1px solid ${borderColor[index]}` }}></span>{item}</p>
                            )
                        })}
                    </div>
                    <p>Itens mais vendidos</p>
                </div>

            </div>
        </>
    )
}