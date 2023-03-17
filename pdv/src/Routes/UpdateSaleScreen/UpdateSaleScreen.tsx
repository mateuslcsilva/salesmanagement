import React, { useEffect, useState } from 'react'
import './styles.css'
import Button from '../../components/Button/Button'
import { Alert, TextField } from '@mui/material'
import SaleAccordion from '../../components/SaleAccordion/SaleAccordion'
import { Checkbox } from '@nextui-org/react'
import { sale } from '../../types/sale/sale'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { useOrderContext } from '../../utils/contexts/OrderContext'
import { db } from '../../utils/firebase/firebase'
import { ConfirmationModal } from '../../components/ConfirmationModal/ConfirmationModal'
import { InputSearchSale } from '../../components/InputSeachSale/InputSearchSale'
import { itemType } from '../../types/itemType/itemType'

export const UpdateSaleScreen = () => {

    const [itemList, setItemList] = useState<itemType[]>([])
    const [currentUserId, setCurrentUserId] = useState<string>()
    const [tableNumber, setTableNumber] = useState(0)
    const [saleNumber, setSaleNumber] = useState(0)
    const [costumerName, setCostumerName] = useState('')
    const [saleIndex, setSaleIndex] = useState<number[] | number>()
    const [sale, setSale] = useState<sale | sale[]>({} as sale)
    const [alert, setAlert] = useState(<p></p>)
    const [sales, setSales] = useState([] as sale[])
    const [selected, setSelected] = useState<Array<string> | undefined>([])
    const [newTableNumber, setNewTableNumber] = useState<number>(0)
    const [newSaleNumber, setNewSaleNumber] = useState<number>(0)
    const [action, setAction] = useState(0)
    const [visible, setVisible] = useState(false);
    const [permission, setPermission] = useState(false)
    const AuthContext = useAuthContext()

    const handler = () => setVisible(true);
    const closeHandler = () => setVisible(false);

    const getItems = async () => {
        if (AuthContext.currentUser.id == '') return false
        let docRef = doc(db, "empresas", `${AuthContext.currentUser.id}`)
        let data = await getDoc(docRef)
            .then(res => {
                setItemList(res.data()?.items)
                setSales(res.data()?.sales)
            })
    }

    const getItemText = (typeParam: string, value: number | undefined) => {
        if (AuthContext.currentUser.id == '') return
        if (!value) return
        if (typeParam == "numItem") {
            let index = itemList.findIndex(item => item.numItem == value)
            //@ts-ignore
            let text = (itemList[index]?.numItem < 10 ? '0' + itemList[index]?.numItem : itemList[index]?.numItem.toString()) + ' - ' + itemList[index]?.item + ' ' + itemList[index]?.itemValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
            return text
        }
        if (!itemList[value]) return ''
        if (typeParam == "index") {
            //@ts-ignore
            let text = (itemList[value]?.numItem < 10 ? '0' + itemList[value]?.numItem : itemList[value]?.numItem.toString()) + ' - ' + itemList[value]?.item + ' ' + itemList[value]?.itemValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
            return text
        }
    }

    const getSelectedIndex = (index: number) => {
        if (Array.isArray(saleIndex) && saleIndex[index] != undefined) return setSaleIndex(saleIndex[index])
        window.alert("Erro ao obter a venda, por favor, informe o desenvolvedor!")
    }

    const findTable = () => {
        let salesIndex: number[] = []
        sales.forEach((item: sale, index: number) => {
            if (item.numTable == tableNumber) {
                salesIndex.push(index)
            }
        })
        setSaleIndex(salesIndex.length > 1 ? salesIndex : salesIndex[0])
        let currentSale: sale[] = []
        sales.forEach((sale: sale, index: number) => {
            if (salesIndex.includes(index)) {
                currentSale.push(sale)
            }
        })
        if (salesIndex.length == 0){
            clear()
            return setAlert(<Alert severity="warning">Nenhuma comanda encontrada!</Alert>)
        }

        setSale(currentSale.length == 1 ? { ...sale, ...currentSale[0] } : currentSale)
    }

    const findSale = () => {
        let salesIndex: any = []
        sales.forEach((item: sale, index: number) => {
            if (item.numSale == saleNumber) {
                salesIndex.push(index)
            }
        })

        if (salesIndex.length == 1) salesIndex = salesIndex[0]
        if (salesIndex.length == 0) {
            clear()
            return setAlert(<Alert severity="warning">Nenhuma comanda encontrada!</Alert>)
        }
        if (Array.isArray(salesIndex)) return window.alert("Ocorreu um erro, por favor contate o desenvolvedor!")

        setSaleIndex(salesIndex)
        setSale(sales[salesIndex])
    }

    const findCostumer = () => {
        let salesIndex: number[] = []
        sales.forEach((item: sale, index: number) => {
            if (item.costumerName?.toLowerCase().trim() == costumerName?.toLowerCase().trim()) {
                salesIndex.push(index)
            }
        })
        if (salesIndex.length == 0) {
            clear()
            return setAlert(<Alert severity="warning">Nenhuma comanda encontrada!</Alert>)
        }
        setSaleIndex(salesIndex.length > 1 ? salesIndex : salesIndex[0])
        let currentSale: sale[] = []
        sales.forEach((sale: sale, index: number) => {
            if (salesIndex.includes(index)) {
                currentSale.push(sale)
            }
        })
        setSale(currentSale.length == 1 ? currentSale[0] : currentSale)
    }

    const deleteItems = () => {
        let selectedItems = selected?.map(item => Number(item))
        if (typeof saleIndex == "number") {
            selectedItems?.forEach((item) => {
                sales[saleIndex].orders.splice(item, 1)
            })
            let totalValue = 0
            sales[saleIndex].orders?.map(order => {
                let item = itemList.find(item => item.numItem == order)
                if (item) totalValue += Number(item.itemValue)
            })
            sales[saleIndex].totalValue = totalValue
            updateSales()
            clear()
            setAlert(<Alert severity="success">Pronto, pedidos excluídos!</Alert>)
        }
    }

    const transferringOrders = () => {
        if (selected == undefined || typeof saleIndex != "number") return
        if (selected.length == sales[saleIndex].orders.length) {
            let confirm = window.confirm("Isso irá excluir a comanda, clique confirmar para continuar.")
            if (!confirm) return setPermission(false)
        }
        const selectedItems = selected?.map(order => Number(order))
        const currentSale = sales.findIndex(sale => sale.numSale == newSaleNumber)
        let deletedItems = sales[saleIndex].orders.filter((order: number, index: number) => selectedItems.includes(index))

        selectedItems?.sort().reverse().forEach((item) => {
            sales[saleIndex].orders.splice(item, 1)
        })
        let totalValue = 0
        console.log("here")
        sales[saleIndex].orders?.map(order => {
            let item = itemList.find(item => item.numItem == order)
            if (item) totalValue += Number(item.itemValue)
        })
        sales[saleIndex].totalValue = totalValue

        console.log("here")
        console.log(currentSale)

        if (currentSale > 0) {

            console.log(currentSale, sales[currentSale], sales[currentSale]?.orders, deletedItems)
            sales[currentSale].orders = [...sales[currentSale]?.orders, ...deletedItems]
            let totalValueCurrentSale = 0
            sales[currentSale].orders?.map(order => {
                let item = itemList.find(item => item.numItem == order)
                if (item) totalValueCurrentSale += Number(item.itemValue)
            })
            console.log("here")
            sales[currentSale].totalValue = totalValueCurrentSale
        } else {
            let current = new Date
            let currentDay = current.getDate().toString().length < 2 ? '0' + current.getDate() : current.getDate()
            let currentMonth = current.getMonth().toString().length < 2 ? '0' + (current.getMonth() + 1) : (current.getMonth() + 1)
            let currentDate = currentDay + '/' + currentMonth + '/' + current.getFullYear()
            let currentTime = current.getHours() + ':' + (current.getMinutes() < 10 ? "0" + current.getMinutes() : current.getMinutes())
            let updatedSale = {
                numTable: "Não informado",
                numSale: newSaleNumber,
                orders: deletedItems,
                costumerName: "Não informado",
                date: currentDate,
                time: currentTime,
                loggedUser: AuthContext.currentUser.userName,
                totalValue: 0
            }
            console.log("here")
            let totalValue = 0
            updatedSale.orders?.map(order => {
                let item = itemList.find(item => item.numItem == order)
                if (item) totalValue += Number(item.itemValue)
            })
            updatedSale.totalValue = totalValue
            //@ts-ignore
            sales.push(updatedSale)
        }
        if (sales[saleIndex].orders.length == 0) sales.splice(saleIndex, 1)
        updateSales()
        clear()
        setAlert(<Alert severity="success">Pronto, pedidos transferidos!</Alert>)
    }

    const changeNumTable = () => {
        
        console.log(newTableNumber)
        if (tableNumber < 0) return
        if (typeof saleIndex == "number") {
            console.log(newTableNumber)
            sales[saleIndex].numTable = Number(newTableNumber)
        }
        updateSales()
        clear()
        setAlert(<Alert severity="success">Pronto, número da mesa alterada!</Alert>)
    }

    const deleteSale = () => {
        let confirm = window.confirm("Deseja realmente excluir a comanda?")
        if (!confirm || typeof saleIndex != "number") return
        sales.splice(saleIndex, 1)
        updateSales()
        clear()
        setAlert(<Alert severity="success">Pronto, comanda excluída!</Alert>)
    }

    const updateSales = async () => {
        await updateDoc(doc(db, "empresas", `${AuthContext.currentUser.id}`), {
            sales: sales
        }).then(res => console.log(res))
            .catch(err => console.log(err.message))
        clear()
    }

    const clear = () => {
        setSale({} as sale)
        setSaleIndex([])
        setAction(0)
        setSaleNumber(0)
        setTableNumber(0)
        setCostumerName('')
        setNewTableNumber(0)
        setNewSaleNumber(0)
        setSelected([])
        setPermission(false)
    }

    useEffect(() => {
        const clearAlert = setTimeout(() => {
            setAlert(<p></p>)
        }, 5000)

        return () => clearTimeout(clearAlert)
    })

    useEffect(() => {
        setCurrentUserId(AuthContext.currentUser.id)
    }, [AuthContext.currentUser.id])

    useEffect(() => {
        getItems()
    }, [])

    useEffect(() => {
        if (!permission) return
        switch (action) {
            case 0:
                deleteSale()
                break
            case 1:
                deleteItems()
                break
            case 2:
                console.log("here")
                changeNumTable()
                break
            case 3:
                transferringOrders()
                break
            default:
                return
        }
    }, [permission])

    useEffect(() => {
        console.log(newTableNumber)
        console.log("permission: ", permission)
    }, [newTableNumber, permission])

    return (
        <>
            <div className='div' id='div1'>
                <ConfirmationModal handler={handler} closeHandler={closeHandler} visible={visible} setPermission={setPermission} setAlert={setAlert} />
                <h3 className='title is-3 mt-3'>ALTERAR PEDIDO</h3>

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
                    className='is-info ml-2'
                    disabled={Array.isArray(sale) || sale.numSale ? true : false}
                    onClick={saleNumber ? findSale : (tableNumber ? findTable : findCostumer)}
                    text='Buscar'
                />


                {alert}

                {
                    ((saleNumber > 0 || costumerName != '' || tableNumber > 0) && (typeof saleIndex == "number")) &&
                    <div className='saleInfo mb-3 mt-5 primary-text'>
                        <p className='title is-5'>
                            {sales[saleIndex].numTable ? 'Mesa: ' + sales[saleIndex].numTable + '  |  ' : ''} {/* MOSTRA O NÚMERO DA MESA, SE HOUVER */}
                            {sales[saleIndex].costumerName ? 'Cliente: ' + sales[saleIndex].costumerName + '  |  ' : ''} {/* MOSTRA O NOME DO CLIENTE, SE HOUVER */}
                            {sales[saleIndex].numSale ? 'Comanda ' + sales[saleIndex].numSale + '\n' : ''} {/* MOSTRA O NÚMERO DA COMANDA, E SÓ É EXIBIDO CASO O CAMPO COMANDA ESTEJA PREENCHIDO */}
                        </p>
                        {sales[saleIndex].orders && sales[saleIndex].orders.map((item: any, index: number) => <p key={index}>{getItemText("numItem", item)}</p>)}
                        {sales[saleIndex].orders?.length > 0 && <p className='mt-3 title is-5'> Total: {sales[saleIndex].totalValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>}
                    </div>
                }

                {Array.isArray(sale) &&
                    <div>
                        <SaleAccordion sale={sale} selectedSale={(selectedSale: sale) => setSale(selectedSale)} selectedIndex={getSelectedIndex} />
                    </div>
                }

                <div className='is-flex is-justify-content-space-evenly mt-5'>
                    <Button
                        onClick={() => setAction(1)}
                        className='is-info mt-5 mb-5'
                        text='Excluir Pedido'
                        disabled={saleIndex == undefined || Array.isArray(saleIndex) ? true : false}
                    />
                    <Button
                        onClick={() => setAction(2)}
                        className='is-info mt-5 mb-5'
                        text='Mudar Mesa'
                        disabled={saleIndex == undefined || Array.isArray(saleIndex) ? true : false}
                    />
                    <Button
                        onClick={() => setAction(3)}
                        className='is-info mt-5 mb-5'
                        text='Migrar Pedidos'
                        disabled={saleIndex == undefined || Array.isArray(saleIndex) ? true : false}
                    />

                    <Button
                        onClick={() => {
                            setAction(0)
                            handler()
                        }}
                        className='is-info mt-5 mb-5'
                        text='Excluir Comanda'
                        disabled={saleIndex == undefined || Array.isArray(saleIndex) ? true : false}
                    />
                </div>

                <div>

                    {action == 1 &&
                        <div>
                            <Checkbox.Group
                                label="Selecione o pedido a ser excluído:"
                                color="error"
                                value={selected}
                                onChange={setSelected}
                            >
                                {/* @ts-ignore */}
                                {sales[saleIndex].orders.map((order: number, index: number) => <Checkbox value={index.toString()} className={selected?.includes(index.toString()) ? 'strike' : ''}>{getItemText("numItem", order)}</Checkbox>)}
                            </Checkbox.Group>
                            <div className='is-flex is-justify-content-flex-end mt-5 mb-5'>
                                <Button
                                    className='is-danger ml-2 mb-5'
                                    disabled={selected == undefined || selected.length < 1 ? true : false}
                                    onClick={handler}
                                    text='Excluir pedido'
                                />
                            </div>
                        </div>
                    }
                    {action == 2 &&
                        <div className='is-flex is-justify-content-center mb-5 mt-5'>
                            <InputSearchSale
                                label="Mesa "
                                marginBot={true}
                                sale={sale}
                                value={newTableNumber}
                                set={setNewTableNumber}
                                nonDisabled
                            />
                            <Button
                                className='is-info ml-2 mb-5'
                                disabled={newTableNumber == 0 ? true : false}
                                onClick={handler}
                                text='Alterar'
                            />
                        </div>
                    }
                    {action == 3 &&
                        <div className='is-flex is-justify-content-space-around mb-5 mt-5'>
                            <Checkbox.Group
                                label="Selecione o pedido a ser transferido:"
                                color="error"
                                value={selected}
                                onChange={setSelected}
                            >
                                {/* @ts-ignore */}
                                {sales[saleIndex].orders.map((order: number, index: number) => <Checkbox value={index.toString()} className={selected?.includes(index.toString()) ? 'strike' : ''}>{getItemText("numItem", order)}</Checkbox>)}
                            </Checkbox.Group>
                            <div>
                                <InputSearchSale
                                    label="Comanda "
                                    marginBot={true}
                                    sale={sale}
                                    value={newSaleNumber}
                                    set={setNewSaleNumber}
                                    nonDisabled
                                />
                                <Button
                                    className='is-info ml-2 mb-5'
                                    disabled={newSaleNumber == 0 || selected == undefined || selected.length < 1 ? true : false}
                                    onClick={handler}
                                    text='Transferir pedidos'
                                />
                            </div>
                        </div>
                    }
                </div>

                <div className='btn-limpar-centered mt-5'>
                    <Button onClick={clear} disabled={saleIndex == undefined ? true : false} text='Limpar' />
                </div>
            </div>
        </>
    )
}