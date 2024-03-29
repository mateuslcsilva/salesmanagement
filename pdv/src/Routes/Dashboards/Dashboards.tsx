import React, { useState } from 'react'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
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
import { Pie, Chart } from 'react-chartjs-2';
import './styles.css'
import { months } from '../../utils/consts'
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


export const Dashboards = () => {
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

    const getTotalSaleValue = (month = (new Date()).getMonth(), day = 0) => {
        let totalSaleValue = 0
        SalesContext.sales.forEach(sale => {
            if (Number(sale.date.substring(4, 5)) - 1 == month && (day == 0 || Number(sale.date.substring(0, 2)) == day)) {
                totalSaleValue += sale.totalValue
            }
        })
        SalesHistoryContext.salesHistory?.forEach(sale => {
            if (Number(sale.date.substring(4, 5)) - 1 == month && (day == 0 || Number(sale.date.substring(0, 2)) == day)) {
                totalSaleValue += sale.totalValue
            }
        })
        return totalSaleValue
    }

    const getNumberOfSales = (month = (new Date()).getMonth(), day = 0) => {
        let numberOfSales = 0
        SalesContext.sales.forEach(sale => {
            if (Number(sale.date.substring(4, 5)) - 1 == month && (day == 0 || Number(sale.date.substring(0, 2)) == day)) {
                numberOfSales++
            }
        })
        SalesHistoryContext.salesHistory?.forEach(sale => {
            if (Number(sale.date.substring(4, 5)) - 1 == month && (day == 0 || Number(sale.date.substring(0, 2)) == day)) {
                numberOfSales++
            }
        })
        return numberOfSales
    }

    const getMostSelledItem = () => {
        let allSelledItems: Array<number> = []
        SalesContext.sales.forEach(sale => {
            if (Number(sale.date.substring(4, 5)) - 1 == (new Date()).getMonth()) {
                allSelledItems.push(...sale.orders)
            }
        })
        SalesHistoryContext.salesHistory?.forEach(sale => {
            if (Number(sale.date.substring(4, 5)) - 1 == (new Date()).getMonth()) {
                allSelledItems.push(...sale.orders)
            }
        })

        let mostSelledItems: Array<{ element: number, appearences: number, text: string }> = []
        allSelledItems.forEach(item => {
            if (mostSelledItems && mostSelledItems.find(element1 => element1.element == item)) return false
            if (count(allSelledItems, item)) mostSelledItems.push(count(allSelledItems, item))
        })
        return mostSelledItems.sort((a, b) => b.appearences - a.appearences)
    }

    const getDaysOfTheMonth = () => {
        let daysOfTheMonth: Array<number> = []
        let lastDayOfMonth = new Date((new Date().getFullYear()), (new Date().getMonth()) + 1, 0).getDate()
        for (let i = 1; i <= lastDayOfMonth; i++) {
            daysOfTheMonth.push(i)
        }
        return (daysOfTheMonth)
    }

    const getNumberOfSalesPerDay = () => {
        let salesPerDay: number[] = []
        getDaysOfTheMonth().forEach(day => {
            if (getNumberOfSales((new Date).getMonth(), day) > 0) salesPerDay.push(getNumberOfSales((new Date).getMonth(), day))
        })
        return salesPerDay
    }

    const getValueOfSalesPerDay = () => {
        let valuePerDay: number[] = []
        getDaysOfTheMonth().forEach(day => {
            if (getTotalSaleValue((new Date).getMonth(), day) > 0) valuePerDay.push(getTotalSaleValue((new Date).getMonth(), day))
        })
        return valuePerDay
    }

    const getNumberOfSalesPerMonth = () => {
        let salesPerDay: Array<number | undefined> = []
        months.forEach((month, index) => {
            if (getNumberOfSales(index) == 0) return salesPerDay.push(undefined)
            salesPerDay.push(getNumberOfSales(index))
        })
        return salesPerDay
    }

    const getValueOfSalesPerMonth = () => {
        let valuePerDay: Array<number | undefined> = []
        months.forEach((month, index) => {
            if (getTotalSaleValue(index) == 0) return valuePerDay.push(undefined)
            valuePerDay.push(getTotalSaleValue(index))
        })
        return valuePerDay
    }

    const toggleHiddenInfo = (info: string) => {
        if (hiddenInfo.includes(info)) {
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
                rotation: 25,
                data: getMostSelledItem().map(element => element.appearences).splice(0, 5),
                backgroundColor: document.querySelector('.main')?.classList.contains('darkThemed') ? borderColor : backgroundColor,
                borderColor: borderColor,
                borderWidth: 1,
                cutout: 70,
                weight: 200
            },
        ],
    };

    const dataSalesOfMonth = {
        labels: getDaysOfTheMonth(),
        datasets: [
            {
                type: 'line' as const,
                label: 'Quantidade de Vendas',
                borderColor: document.querySelector('.main')?.classList.contains('darkThemed') ? "#f2f2f2" : "#191919",
                backgroundColor: document.querySelector('.main')?.classList.contains('darkThemed') ? "#f2f2f290" : "#191919",
                borderWidth: 1,
                data: getNumberOfSalesPerDay(),
            },
            {
                type: 'bar' as const,
                label: 'Valor total (R$)',
                backgroundColor: '#3488ceab',
                data: getValueOfSalesPerDay(),
                borderColor: '#3488ce',
                borderWidth: 2,
            }
        ]
    }

    const dataSalesOfYear = {
        labels: months,
        datasets: [
            {
                type: 'line' as const,
                label: 'Quantidade de Vendas',
                borderColor: document.querySelector('.main')?.classList.contains('darkThemed') ? "#f2f2f2" : "#191919",
                backgroundColor: document.querySelector('.main')?.classList.contains('darkThemed') ? "#f2f2f290" : "#191919",
                borderWidth: 1,
                fill: false,
                data: getNumberOfSalesPerMonth(),
            },
            {
                type: 'bar' as const,
                label: 'Valor total',
                backgroundColor: '#3488ceab',
                data: getValueOfSalesPerMonth(),
                borderColor: '#3488ce',
                borderWidth: 2,
            }
        ]
    }

    const charOptions: any = {
        plugins: {
            legend: {
                labels: {
                    color: "#fff"
                }
            },
        },
        scales: {
            y: {
                ticks: {
                    color: "#fff",
                }
            },
            x: {
                ticks: {
                    color: "#fff",
                }
            }
        }

    }

    return (
        <>
            <h1 className='dashboards-title'>
                <i className="bi bi-clipboard-data"></i>
                Dashboards
            </h1>
            <h3 className='section-title'><i className="bi bi-wallet2"></i>Números do mês</h3>
            <p className='section-sub-title'>Seu mês até agora</p>
            <div className={AuthContext.currentUser.userType == "Padrão" ? 'primary-data hidden-info' : 'primary-data'}>
                <div>
                    <i className="bi bi-cash-stack"></i>
                    <div className={getTotalSaleValue() > 9999 ? "primary-data-info small-font-size" : "primary-data-info"}>
                        <h1
                            className={hiddenInfo.includes("totalValue") ? 'info hidden-info' : 'info'}
                            onClick={() => toggleHiddenInfo("totalValue")}
                        >
                            {hiddenInfo.includes("totalValue") ? "R$****" : getTotalSaleValue().toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                        </h1>
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
                            {hiddenInfo.includes("ticket") ? "R$****" : (!isNaN(getTotalSaleValue() / getNumberOfSales()) ? (getTotalSaleValue() / getNumberOfSales()) : 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                        </h1>
                        <p>Ticket Médio</p>
                    </div>
                </div>
            </div>
            <h3 className='section-title'><i className="bi bi-graph-up-arrow"></i>Gráficos</h3>
            <p className='section-sub-title'>Análise detalhada das informações do mês</p>
            <div className={AuthContext.currentUser.userType == "Padrão" ? 'charts hidden-info' : 'charts'}>
                <div className='div1'>
                    <h1>Resultados Mensal</h1>
                    <Chart type='bar' data={dataSalesOfMonth} className='bar-chart' options={document.querySelector('.main')?.classList.contains('darkThemed') ? charOptions : {}} />
                </div>
                <div className='div2'>
                    <h1>Resultados Anual</h1>
                    <Chart type='bar' data={dataSalesOfYear} className='bar-chart' options={document.querySelector('.main')?.classList.contains('darkThemed') ? charOptions : {}} />
                </div>
                <div className='div3'>
                {getMostSelledItem().length > 0 &&
                        <div>
                        <Pie data={data} className='pie-chart' />
                        <div className='pie-chart-legends'>

                            {getMostSelledItem().map(element => element.text).splice(0, 5).map((item, index) => {
                                return (
                                    <div id='pie-chart-legend'>
                                        <span
                                            style={{ "backgroundColor": document.querySelector('.main')?.classList.contains('darkThemed') ? borderColor[index] : backgroundColor[index], "border": `1px solid ${borderColor[index]}` }}
                                        ></span>
                                        <p className='pie-chart-legend-text'>
                                            <abbr title={item}>{item}</abbr>
                                        </p></div>
                                )
                            })}
                        </div>
                        <p className='most-selled-items-footer'>Itens mais vendidos</p>
                    </div>}
                    {getMostSelledItem().length == 0 &&
                        <div className='no-most-salled-item'>
                            <i className="bi bi-pie-chart"></i>
                            <p>Ops, parece que ainda não há vendas hoje.</p>
                        </div>
                    }
                </div>

            </div>
        </>
    )
}