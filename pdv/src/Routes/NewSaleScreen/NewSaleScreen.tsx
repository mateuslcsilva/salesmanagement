import React, { useState, useEffect, createContext, useContext } from 'react'
import './styles.css'
import { Alert, TextField } from '@mui/material'
import Button from '../../components/Button/Button'
import ItemsListInput from '../../components/ItemsListInput/ItemsListInput'
import { sale } from '../../types/sale/sale'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase/firebase'
import { queryData } from '../../utils/requests/queryData'
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { useOrderContext } from '../../utils/contexts/OrderContext'


export const NewSaleScreen = () => {

    const [itemList, setItemList] = useState<itemType[]>([])
    const [currentUserId, setCurrentUserId] = useState<string>()
    const [tableNumber, setTableNumber] = useState<number>(0)
    const [saleNumber, setSaleNumber] = useState<number>(0)
    const [costumerName, setCostumerName] = useState('')
    const [currentOrder, setCurrentOrder] = useState<number>(0)
    const [alert, setAlert] = useState(<p></p>)
    const [sale, setSale] = useState<sale>({} as sale)
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
            .then(res => res.data()?.items)
        setItemList(data)
    }

    const getItemText = (typeParam: string, value: number | undefined) => {
        if (AuthContext.currentUser.id == '') return
        if (!value) return
        if (typeParam == "numItem") {
            let index = itemList.findIndex(item => item.numItem == value)
            //@ts-ignore
            let text = (itemList[index]?.numItem < 10 ? '0' + itemList[index]?.numItem : itemList[index]?.numItem.toString()) + ' - ' + itemList[index]?.item + ' ' + itemList[index]?.itemValue.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
            return text
        }
        if (!itemList[value]) return ''
        if (typeParam == "index") {
            //@ts-ignore
            let text = (itemList[value]?.numItem < 10 ? '0' + itemList[value]?.numItem : itemList[value]?.numItem.toString()) + ' - ' + itemList[value]?.item + ' ' + itemList[value]?.itemValue.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
            return text
        }
    }

    const setTable = async () => {
        console.log(AuthContext.currentUser.id)
        if (saleNumber == 0) return false

        let alert = ""
        await getDoc(doc(db, "empresas", `${AuthContext.currentUser.id}`))
        .then(res => {
            let sales = res.data()?.sales
            if(sales){
                sales.forEach((sale :sale) => {
                    if(!sale.closed && sale.numSale == saleNumber) {
                        alert = "Essa comanda já está em uso!"
                    }
                })
            }
        })
        if(alert) return window.alert(alert)
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
        if(currentOrder == 0) return window.alert("Por favor, selecione item novamente!")
        let updatedSale = {
            orders: [...sale.orders, currentOrder],
        }

        setSale(sale => ({ ...sale, ...updatedSale }))
        setAlert(<Alert severity="success" >Pedido registrado!</Alert>)
        setCurrentOrder(0)
    }

    const getTotalValue = () => {
        let totalValue = 0
        sale.orders?.map(order => {
            let item = itemList.find(item => item.numItem == order)
            if(item) totalValue += Number(item.itemValue)
        })
        let obj = {totalValue: totalValue}
        setSale(sale => ({...sale, ...obj}))
    }

    const clear = () => {
        setSale({} as sale)
        setCurrentOrder(0)
        setSaleNumber(0)
        setTableNumber(0)
        setCostumerName('')
        setAlert(<p></p>)
    }

    const updateSales = async () => {
        const update = await queryData("saleUpdate", "null", { id: AuthContext.currentUser.id, sale: sale })
            .then(res => {
                clear()
                return /* toast.success("Venda salva com sucesso!") */
            })
            .catch(err => console.log(err.message))
    }
    
    useEffect(() => {
        console.log(sale)
    }, [sale])

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
        getItems()
    }, [currentUserId])

    useEffect(() => {
        if(orderContext.currentOrder) setCurrentOrder(orderContext.currentOrder)
    }, [orderContext.currentOrder])

    return (
        <>
            <div className='div' id='div1'>
                <h3 className='title is-3 mt-3'>ABRIR COMANDA</h3>
                <TextField
                    id="outlined-basic"
                    label="Mesa"
                    variant="outlined"
                    size="small"
                    onChange={(e: any) => setTableNumber(isNaN(e.target.value) ? 0 : Number(e.target.value))}
                    value={tableNumber < 1 ? '' : tableNumber}
                    style={{ 'width': '105px' }}
                    className='mr-2 align-right-sla'
                />

                <TextField
                    id="outlined-basic-string"
                    label="Nome"
                    variant="outlined"
                    size="small"
                    onChange={(e: any) => setCostumerName(e.target.value)}
                    value={costumerName}
                    style={{ 'width': '105px' }}
                    className='mr-2'
                />

                <TextField
                    id="outlined-basic"
                    label="Comanda*"
                    variant="outlined"
                    size="small"
                    onChange={(e: any) => setSaleNumber(isNaN(e.target.value) ? 0 : Number(e.target.value))}
                    value={saleNumber < 1 ? '' : saleNumber}
                    style={{ 'width': '105px' }}
                    className='mr-2'
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
                    />

                <Button
                    onClick={setOrder}
                    className='is-info mb-5'
                    text='Acrescentar item'
                    disabled={!sale.numSale ? true : false}
                />
                {saleNumber > 0 &&
                    <div className='saleInfo mb-3'>
                        <p className='title is-5'>
                            {sale.numTable ? 'Mesa: ' + sale.numTable + '  |  ' : ''} {/* MOSTRA O NÚMERO DA MESA, SE HOUVER */}
                            {sale.costumerName ? 'Cliente: ' + sale.costumerName + '  |  ' : ''} {/* MOSTRA O NOME DO CLIENTE, SE HOUVER */}
                            {sale.numSale ? 'Comanda ' + sale.numSale + '\n' : ''} {/* MOSTRA O NÚMERO DA COMANDA, E SÓ É EXIBIDO CASO O CAMPO COMANDA ESTEJA PREENCHIDO */}
                        </p>
                        {sale.orders && sale.orders.map((item: any, index: number) => <p key={index}>{getItemText("numItem", item)}</p>)}
                        <p className='mt-3 title is-5'> Total: {sale.totalValue.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</p>
                    </div>
                }

                {alert}

                <div className='btn-limpar-centered mt-5'>
                    <Button
                        onClick={updateSales}
                        disabled={sale.numSale == undefined || sale.orders.length < 1 ? true : false}
                        text='Salvar'
                        className="is-success"
                    />
                    <Button onClick={clear} disabled={sale.numSale == undefined ? true : false} text='Limpar' />
                </div>
            </div>
{/*             <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"></ToastContainer> */}
        </>
    )
}