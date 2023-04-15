import React, { useEffect, useState } from 'react'
import './styles.css'
import Button from '../../components/Button/Button'
import { Alert } from '@mui/material'
import SaleAccordion from '../../components/SaleAccordion/SaleAccordion'
import { Checkbox } from '@nextui-org/react'
import { sale } from '../../types/sale/sale'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { ConfirmationModal } from '../../components/ConfirmationModal/ConfirmationModal'
import { InputSearchSale } from '../../components/InputSeachSale/InputSearchSale'
import { useItemListContext } from '../../utils/contexts/ItemsProvider'
import { useSalesContext } from '../../utils/contexts/SalesProvider'

export const UpdateSaleScreen = () => {
    const [currentUserId, setCurrentUserId] = useState<string>()
    const [tableNumber, setTableNumber] = useState(0)
    const [saleNumber, setSaleNumber] = useState(0)
    const [costumerName, setCostumerName] = useState('')
    const [sale, setSale] = useState<sale | sale[]>({} as sale)
    const [alert, setAlert] = useState(<p></p>)
    const [selected, setSelected] = useState<Array<string> | undefined>([])
    const [newTableNumber, setNewTableNumber] = useState<number>(0)
    const [newSaleNumber, setNewSaleNumber] = useState<number>(0)
    const [action, setAction] = useState(0)
    const [visible, setVisible] = useState(false);
    const [permission, setPermission] = useState(false)
    const AuthContext = useAuthContext()
    const ItemListContext = useItemListContext()
    const SalesContext = useSalesContext()

    const handler = () => setVisible(true);
    const closeHandler = () => setVisible(false); 

    const getItemText = (typeParam: string, value: number | undefined) => {
        if (AuthContext.currentUser.id == '') return
        const itemList = ItemListContext.itemList
        if(!itemList) return
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

    const findTable = () => {
        let salesIndex: number[] = []
        SalesContext.sales.forEach((item: sale, index: number) => {
            if (item.numTable == tableNumber) {
                salesIndex.push(index)
            }
        })
        let currentSale: sale[] = []
        SalesContext.sales.forEach((sale: sale, index: number) => {
            if (sale.numTable == tableNumber) {
                currentSale.push(sale)
            }
        })
        if (currentSale.length == 0) {
            clear()
            return setAlert(<Alert severity="warning">Nenhuma comanda encontrada!</Alert>)
        }

        setSale(currentSale.length == 1 ? { ...sale, ...currentSale[0] } : currentSale)
        setAlert(<p></p>)
    }

    const findSale = () => {
        let currentSale: Array<sale> = []
        SalesContext.sales.forEach((sale: sale, index: number) => {
            if (sale.numSale == saleNumber) {
                currentSale.push(sale)
            }
        })
        if (currentSale.length == 0) {
            clear()
            return setAlert(<Alert severity="warning">Nenhuma comanda encontrada!</Alert>)
        }
        if (currentSale.length > 1) return window.alert("Ocorreu um erro, por favor contate o desenvolvedor!")

        setSale(currentSale[0])
        setAlert(<p></p>)
    }

    const findCostumer = () => {
        let currentSale: sale[] = []
        SalesContext.sales.forEach((sale: sale) => {
            if (sale.costumerName?.toLowerCase().trim() == costumerName?.toLowerCase().trim()) {
                currentSale.push(sale)
            }
        })
        if (currentSale.length == 0) {
            clear()
            return setAlert(<Alert severity="warning">Nenhuma comanda encontrada!</Alert>)
        }
        setSale(currentSale.length == 1 ? currentSale[0] : currentSale)
        setAlert(<p></p>)
    }

    const deleteItems = () => {
        if (Array.isArray(sale)) return
        let selectedItems = selected?.map(item => Number(item))
        let newSale = sale
        selectedItems?.forEach((item) => {
            newSale.orders.splice(item, 1)
        })
        let totalValue = 0
        newSale.orders?.map(order => {
            let item = ItemListContext.itemList.find(item => item.numItem == order)
            if (item) totalValue += Number(item.itemValue)
        })
        newSale.totalValue = totalValue
        setSale({ ...sale, ...newSale })
        updateSales()
        clear()
        setAlert(<Alert severity="success">Pronto, pedidos excluídos!</Alert>)
    }

    const transferringOrders = () => {
        if (selected == undefined || Array.isArray(sale)) return
        let newSale = SalesContext.sales.find(sale => sale.numSale == newSaleNumber)
        let currentSale = sale
        let sales = SalesContext.sales.filter(sale => ![newSale, currentSale].includes(sale))
        if (selected.length == currentSale.orders.length) {
            let confirm = window.confirm("Isso irá excluir a comanda, clique confirmar para continuar.")
            if (!confirm) return setPermission(false)
        }
        const selectedItems = selected?.map(order => Number(order))
        let deletedItems = currentSale.orders.filter((order: number, index: number) => selectedItems.includes(index))

        selectedItems?.sort().reverse().forEach((item) => {
            currentSale.orders.splice(item, 1)
        })
        let totalValue = 0
        currentSale.orders?.map(order => {
            let item = ItemListContext.itemList.find(item => item.numItem == order)
            if (item) totalValue += Number(item.itemValue)
        })
        currentSale.totalValue = totalValue

        if (newSale != undefined) {
            newSale.orders = [...newSale?.orders, ...deletedItems]
            let totalValueCurrentSale = 0
            newSale.orders?.map(order => {
                let item = ItemListContext.itemList.find(item => item.numItem == order)
                if (item) totalValueCurrentSale += Number(item.itemValue)
            })
            newSale.totalValue = totalValueCurrentSale
        } else {
            let current = new Date
            let currentDay = current.getDate().toString().length < 2 ? '0' + current.getDate() : current.getDate()
            let currentMonth = current.getMonth().toString().length < 2 ? '0' + (current.getMonth() + 1) : (current.getMonth() + 1)
            let currentDate = currentDay + '/' + currentMonth + '/' + current.getFullYear()
            let currentTime = current.getHours() + ':' + (current.getMinutes() < 10 ? "0" + current.getMinutes() : current.getMinutes())
            newSale = {
                numTable: "Não informado",
                numSale: newSaleNumber,
                orders: deletedItems,
                costumerName: "Não informado",
                date: currentDate,
                time: currentTime,
                loggedUser: AuthContext.currentUser.userName,
                totalValue: 0
            }
            let totalValue = 0
            newSale.orders?.map(order => {
                let item = ItemListContext.itemList.find(item => item.numItem == order)
                if (item) totalValue += Number(item.itemValue)
            })
            newSale.totalValue = totalValue
        }

        if (newSale) SalesContext.setSales([...sales, currentSale, newSale].filter(sale => sale.orders.length > 0))
        clear()
        setAlert(<Alert severity="success">Pronto, pedidos transferidos!</Alert>)
    }

    const changeNumTable = () => {
        if (tableNumber < 0) return
        if (!Array.isArray(sale)) {
            let newSale = sale
            newSale.numTable = Number(newTableNumber)
            setSale({ ...sale, ...newSale })
        }
        updateSales()
        clear()
        setAlert(<Alert severity="success">Pronto, número da mesa alterada!</Alert>)
    }

    const deleteSale = () => {
        let confirm = window.confirm("Deseja realmente excluir a comanda?")
        if (!confirm || Array.isArray(sale)) return
        SalesContext.setSales(sales => sales.filter(otherSales => otherSales.numSale != sale.numSale))
        clear()
        setAlert(<Alert severity="success">Pronto, comanda excluída!</Alert>)
    }

    const updateSales = async () => {
        if (Array.isArray(sale)) return window.alert("Não foi possível concluir a operação!")
        const cleanedSales = SalesContext.sales.filter(existentSale => existentSale.numSale != sale.numSale)
        SalesContext.setSales([...cleanedSales, sale])
    }

    const clear = () => {
        setSale({} as sale)
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
        if(!Array.isArray(sale) && !sale.numSale) document.getElementById('inputComanda')?.focus()
    }, [sale])

    useEffect(() => {
        if(!Array.isArray(sale)) {
            let newSaleInfo = SalesContext.sales.find(newSaleInfo => newSaleInfo.numSale == saleNumber)
            if(!newSaleInfo) return clear()
            setSale(newSaleInfo)
        }
    }, [SalesContext.sales])

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
        console.log("sale: ", sale)
    }, [sale])

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
                    
                    ((saleNumber > 0 || costumerName != '' || tableNumber > 0) && (!Array.isArray(sale) && sale.numSale > 0)) &&
                    <div className='saleInfo mb-3 mt-5 primary-text'>
                        <p className='title is-5'>
                            {'Mesa: ' + sale.numTable + '  |  '} 
                            {'Cliente: ' + sale.costumerName + '  |  '} 
                            {'Comanda ' + sale.numSale + '\n'} 
                        </p>
                        {sale.orders && sale.orders.map((item: number, index: number) => <p key={index}>{getItemText("numItem", item)}</p>)}
                        {sale.orders?.length > 0 && <p className='mt-3 title is-5'> Total: {sale.totalValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>}
                    </div>
                }

                {Array.isArray(sale) &&
                    <div>
                        <SaleAccordion sale={sale} selectedSale={(selectedSale: sale) => setSale(selectedSale)}/>
                    </div>
                }

                <div className='is-flex is-justify-content-space-evenly mt-5'>
                    <Button
                        onClick={() => setAction(1)}
                        className='is-info mt-5 mb-5'
                        text='Excluir Pedido'
                        disabled={Array.isArray(sale) || sale.numSale == undefined ? true : false}
                    />
                    <Button
                        onClick={() => setAction(2)}
                        className='is-info mt-5 mb-5'
                        text='Mudar Mesa'
                        disabled={Array.isArray(sale) || sale.numSale == undefined ? true : false}
                    />
                    <Button
                        onClick={() => setAction(3)}
                        className='is-info mt-5 mb-5'
                        text='Migrar Pedidos'
                        disabled={Array.isArray(sale) || sale.numSale == undefined ? true : false}
                    />

                    <Button
                        onClick={() => {
                            setAction(0)
                            handler()
                        }}
                        className='is-info mt-5 mb-5'
                        text='Excluir Comanda'
                        disabled={Array.isArray(sale) || sale.numSale == undefined ? true : false}
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
                                {sale.orders.map((order: number, index: number) => <Checkbox value={index.toString()} className={selected?.includes(index.toString()) ? 'strike' : ''}>{getItemText("numItem", order)}</Checkbox>)}
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
                                {sale.orders?.map((order: number, index: number) => <Checkbox value={index.toString()} className={selected?.includes(index.toString()) ? 'strike' : ''}>{getItemText("numItem", order)}</Checkbox>)}
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
                    <Button onClick={clear} disabled={sale == undefined ? true : false} text='Limpar' />
                </div>
            </div>
        </>
    )
}