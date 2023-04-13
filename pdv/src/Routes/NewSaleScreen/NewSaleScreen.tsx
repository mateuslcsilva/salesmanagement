import React, { useState, useEffect } from 'react'
import './styles.css'
import { Alert } from '@mui/material'
import Button from '../../components/Button/Button'
import ItemsListInput from '../../components/ItemsListInput/ItemsListInput'
import { sale } from '../../types/sale/sale'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { useOrderContext } from '../../utils/contexts/OrderContext'
import { InputSearchSale } from '../../components/InputSeachSale/InputSearchSale'
import { useSalesContext } from '../../utils/contexts/SalesProvider'
import { useItemListContext } from '../../utils/contexts/ItemsProvider'


export const NewSaleScreen = () => {

    const [currentUserId, setCurrentUserId] = useState<string>()
    const [tableNumber, setTableNumber] = useState<number>(0)
    const [saleNumber, setSaleNumber] = useState<number>(0)
    const [costumerName, setCostumerName] = useState('')
    const [alert, setAlert] = useState(<p></p>)
    const [sale, setSale] = useState<sale>({} as sale)
    const AuthContext = useAuthContext()
    const orderContext = useOrderContext()
    const SalesContext = useSalesContext()
    const ItemListContext = useItemListContext()

    const getItemText = (typeParam: string, value: number | undefined) => {
        if (AuthContext.currentUser.id == '') return
        if (!value) return
        if (typeParam == "numItem") {
            let index = ItemListContext.itemList.findIndex(item => item.numItem == value)
            //@ts-ignore
            let text = (ItemListContext.itemList[index]?.itemRef < 10 ? '0' + ItemListContext.itemList[index]?.itemRef : ItemListContext.itemList[index]?.itemRef.toString()) + ' - ' + ItemListContext.itemList[index]?.item + ' ' + ItemListContext.itemList[index]?.itemValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
            return text
        }
        if (!ItemListContext.itemList[value]) return ''
        if (typeParam == "index") {
            //@ts-ignore
            let text = (ItemListContext.itemList[value]?.itemRef < 10 ? '0' + ItemListContext.itemList[value]?.itemRef : ItemListContext.itemList[value]?.itemRef.toString()) + ' - ' + ItemListContext.itemList[value]?.item + ' ' + ItemListContext.itemList[value]?.itemValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
            return text
        }
    }

    const setTable = async () => {
        if (saleNumber == 0) return false
        if (SalesContext.sales.find(sale => sale.numSale == saleNumber)) {
            clear()
            return setAlert(<Alert severity="warning">Essa comanda já está em uso!</Alert>)
        }
        let current = new Date
        let currentDay = current.getDate().toString().length < 2 ? '0' + current.getDate() : current.getDate()
        let currentMonth = current.getMonth().toString().length < 2 ? '0' + (current.getMonth() + 1) : (current.getMonth() + 1)
        let currentDate = currentDay + '/' + currentMonth + '/' + current.getFullYear()
        let currentTime = current.getHours() + ':' + (current.getMinutes() < 10 ? "0" + current.getMinutes() : current.getMinutes())
        let updatedSale = {
            numTable: tableNumber ? tableNumber : "Não informado",
            numSale: saleNumber,
            orders: [],
            costumerName: costumerName ? costumerName : "Não informado",
            date: currentDate,
            time: currentTime,
            loggedUser: AuthContext.currentUser.userName
        }
        setSale(sale => ({ ...sale, ...updatedSale }))
    }

    const setOrder = () => {
        if (orderContext.currentOrder == 0 || typeof orderContext.currentOrder == "undefined") return window.alert("Por favor, selecione item novamente!")
        let updatedSale = {
            orders: [...sale.orders, orderContext.currentOrder],
        }

        setSale(sale => ({ ...sale, ...updatedSale }))
        setAlert(<Alert severity="success">Pedido registrado!</Alert>)
        orderContext.setCurrentOrder(0)
    }

    const getTotalValue = () => {
        let totalValue = 0
        sale.orders?.map(order => {
            let item = ItemListContext.itemList.find(item => item.numItem == order)
            if (item) totalValue += Number(item.itemValue)
        })
        let obj = { totalValue: totalValue }
        setSale(sale => ({ ...sale, ...obj }))
    }

    const clear = () => {
        setSale({} as sale)
        orderContext.setCurrentOrder(0)
        setSaleNumber(0)
        setTableNumber(0)
        setCostumerName('')
        setAlert(<p></p>)
    }

    const updateSales = async () => {
        SalesContext.setSales(sales => [...sales, sale])
        clear()
    }

    useEffect(() => {
        getTotalValue()
    }, [sale.orders])

    useEffect(() => {
        const clearAlert = setTimeout(() => {
            setAlert(<p></p>)
        }, 5000)

        return () => clearTimeout(clearAlert)
    }, [alert])

    useEffect(() => {
        setCurrentUserId(AuthContext.currentUser.id)
    }, [AuthContext.currentUser.id])

    useEffect(() => {
        if(!sale.numSale) document.getElementById('inputComanda')?.focus()
    }, [sale])

    return (
        <>
            <div className='div' id='div1'>
                <h3 className='title is-3 mt-3'>ABRIR COMANDA</h3>
                <InputSearchSale
                    label="Mesa"
                    marginBot={true}
                    sale={sale}
                    value={tableNumber}
                    set={setTableNumber}   
                />
                <InputSearchSale
                    label="Nome"
                    marginBot={true}
                    sale={sale}
                    value={costumerName}
                    set={setCostumerName}
                    string={true}
                />
                <InputSearchSale
                    label="Comanda"
                    marginBot={true}
                    sale={sale}
                    value={saleNumber}
                    set={setSaleNumber}
                    autoFocus
                />
                <Button
                    className='is-info ml-2 mb-5'
                    disabled={sale.numSale ? true : false}
                    onClick={setTable}
                    text='Iniciar comanda'
                />

                <ItemsListInput
                    className='is-info mb-5'
                    placeholder="00 - Nome do Pedido"
                    disabled={sale.numSale == undefined ? true : false}
                    updateSales={updateSales}
                />

                <Button
                    onClick={setOrder}
                    onKeyDown={(e :React.KeyboardEvent<HTMLElement>) => {
                        if(e.key == "Enter" && sale.numSale && orderContext.currentOrder != 0)  setOrder()
                    }}
                    className='is-info mb-5'
                    text='Acrescentar item'
                    disabled={!sale.numSale || orderContext.currentOrder == 0 ? true : false}
                />
                {saleNumber > 0 &&
                    <div className='saleInfo mb-3 primary-text'>
                        <p className='title is-5'>
                            {'Mesa: ' + sale.numTable + '  |  '} 
                            {'Cliente: ' + sale.costumerName + '  |  '} 
                            {'Comanda ' + sale.numSale + '\n'} 
                        </p>
                        {sale.orders && sale.orders.map((item: number, index: number) => <p key={index}>{getItemText("numItem", item)}</p>)}
                        {sale.orders?.length > 0 && <p className='mt-3 title is-5'> Total: {sale.totalValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>}
                    </div>
                }

                {alert}

                <div className='btn-limpar-centered mt-5'>
                    <Button
                        onClick={updateSales}
                        disabled={sale.numSale == undefined || sale.orders.length < 1 ? true : false}
                        text='Salvar'
                        className="is-success"
                        id="salvar-venda"
                    />
                    <Button onClick={clear} disabled={sale.numSale == undefined ? true : false} text='Limpar' />
                </div>
            </div>
        </>
    )
}