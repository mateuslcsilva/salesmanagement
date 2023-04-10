import React, { useEffect, useState } from 'react'
import './styles.css'
import Button from '../../components/Button/Button'
import ItemsListInput from '../../components/ItemsListInput/ItemsListInput'
import { Alert } from '@mui/material'
import SaleAccordion from '../../components/SaleAccordion/SaleAccordion'
import { sale } from '../../types/sale/sale'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { useOrderContext } from '../../utils/contexts/OrderContext'
import { InputSearchSale } from '../../components/InputSeachSale/InputSearchSale'
import { useSalesContext } from '../../utils/contexts/SalesProvider'
import { useItemListContext } from '../../utils/contexts/ItemsProvider'
/* import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase/firebase'
import { itemType } from '../../types/itemType/itemType' */

export const AddSaleScreen = () => {

/*     const [itemList, setItemList] = useState<itemType[]>([]) */
    const [currentUserId, setCurrentUserId] = useState<string>()
    const [tableNumber, setTableNumber] = useState(0)
    const [saleNumber, setSaleNumber] = useState(0)
    const [costumerName, setCostumerName] = useState('')
    const [saleIndex, setSaleIndex] = useState<number[] | number>()
    const [sale, setSale] = useState<sale | sale[]>({} as sale)
    const [alert, setAlert] = useState(<p></p>)
/*     const [sales, setSales] = useState([] as sale[]) */
    const AuthContext = useAuthContext()
    const orderContext = useOrderContext()
    const SalesContext = useSalesContext()
    const ItemListContext = useItemListContext()

    /* const getItems = async () => {
        if (AuthContext.currentUser.id == '') return false
        let docRef = doc(db, "empresas", `${AuthContext.currentUser.id}`)
        let data = await getDoc(docRef)
            .then(res => {
                setItemList(res.data()?.items)
                setSales(res.data()?.sales)
            })
    } */

    const getItemText = (typeParam: string, value: number | undefined) => {
        if (AuthContext.currentUser.id == '') return
        let itemList = ItemListContext.itemList
        if (!value) return
        if (typeParam == "numItem") {
            let index = itemList.findIndex(item => item.numItem == value)
            //@ts-ignore
            let text = (itemList[index]?.itemRef < 10 ? '0' + itemList[index]?.itemRef : itemList[index]?.itemRef.toString()) + ' - ' + itemList[index]?.item + ' ' + itemList[index]?.itemValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
            return text
        }
        if (!itemList[value]) return ''
        if (typeParam == "index") {
            //@ts-ignore
            let text = (itemList[value]?.itemRef < 10 ? '0' + itemList[value]?.itemRef : itemList[value]?.itemRef.toString()) + ' - ' + itemList[value]?.item + ' ' + itemList[value]?.itemValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
            return text
        }
    }

    const getSelectedIndex = (index: number) => {
        if (Array.isArray(saleIndex) && saleIndex[index]) return setSaleIndex(saleIndex[index])
        window.alert("Erro ao obter venda.")
    }

    const findTable = () => {
        let salesIndex: number[] = []
        SalesContext.sales.forEach((item: sale, index: number) => {
            if (item.numTable == tableNumber) {
                salesIndex.push(index)
            }
        })
        if(salesIndex.length == 0) {
            clear()
            return setAlert(<Alert severity="warning">Nenhuma comanda encontrada!</Alert>)
        }
        setSaleIndex(salesIndex.length > 1 ? salesIndex : salesIndex[0])
        let currentSale: sale[] = []
        SalesContext.sales.forEach((sale: sale, index: number) => {
            if (salesIndex.includes(index)) {
                currentSale.push(sale)
            }
        })

        setSale(currentSale.length == 1 ? { ...sale, ...currentSale[0] } : currentSale)
    }

    const findSale = () => {
        let salesIndex: any = []
        SalesContext.sales.forEach((item: sale, index: number) => {
            if (item.numSale == saleNumber) {
                salesIndex.push(index)
            }
        })

        if (salesIndex.length == 1) salesIndex = salesIndex[0]
        if(salesIndex.length == 0) {
            clear()
            return setAlert(<Alert severity="warning">Nenhuma comanda encontrada!</Alert>)
        }
        if (Array.isArray(salesIndex)) return window.alert("Ocorreu um erro, por favor contate o desenvolvedor!")

        setSaleIndex(salesIndex)
        setSale(SalesContext.sales[salesIndex])
    }

    const findCostumer = () => {

        let salesIndex: number[] = []
        SalesContext.sales.forEach((item: sale, index: number) => {
            if (item.costumerName?.toLocaleLowerCase().trim() == costumerName?.toLocaleLowerCase().trim()) {
                salesIndex.push(index)
            }
        })
        if(salesIndex.length == 0) {
            clear()
            return setAlert(<Alert severity="warning">Nenhuma comanda encontrada!</Alert>)
        }
        setSaleIndex(salesIndex.length > 1 ? salesIndex : salesIndex[0])
        let currentSale: sale[] = []
        SalesContext.sales.forEach((sale: sale, index: number) => {
            if (salesIndex.includes(index)) {
                currentSale.push(sale)
            }
        })
        setSale(currentSale.length == 1 ? currentSale[0] : currentSale)
    }

    const setOrder = () => {
        if (!Array.isArray(sale) && orderContext.currentOrder != undefined) {
            let newSale = sale
            let oldValue = sale.totalValue
            let newValue = 0
            ItemListContext.itemList.forEach(item => {
                if (item.numItem == orderContext.currentOrder) {
                    //@ts-ignore
                    newValue = item.itemValue
                }
            })
            newSale.totalValue += newValue
            newSale.orders.push(orderContext.currentOrder)
            setSale({...sale, ...newSale})
            setAlert(<Alert severity="success">Pedido registrado!</Alert>)
            orderContext.setCurrentOrder(0)
        }
    }

    const updateSales = async () => {
        if(Array.isArray(sale)) return window.alert("Não foi possível concluir a operação!")
        const cleanedSales = SalesContext.sales.filter(existentSale => existentSale.numSale != sale.numSale)
         SalesContext.setSales([...cleanedSales, sale])
         clear()
/*         await updateDoc(doc(db, "empresas", `${AuthContext.currentUser.id}`), {
            sales: sales
        })
        clear() */
    }

    const clear = () => {
        setSale({} as sale)
        setSaleIndex([])
        setSaleNumber(0)
        setTableNumber(0)
        setCostumerName('')
        orderContext.setCurrentOrder(0)
        setAlert(<p></p>)
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

/*     useEffect(() => {
        getItems()
    }, []) */
    useEffect(() => {
        console.log(sale)
    }, [sale])

    return (
        <>
            <div className='div' id='div1'>
                <h3 className='title is-3 mt-3'>ACRESCENTAR ITEM</h3>
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

                <ItemsListInput
                    className='is-info mt-5'
                    placeholder="00 - Nome do Pedido"
                    disabled={Array.isArray(sale) || !sale.numSale? true : false}
                />

                <Button
                    onClick={setOrder}
                    disabled={Array.isArray(sale) || !sale.numTable || orderContext.currentOrder == 0 ? true : false}
                    className='is-info mt-5 mb-5'
                    text='Acrescentar item'
                />
                {
                    ((saleNumber > 0 || costumerName != '' || tableNumber > 0) && (!Array.isArray(sale) && sale.numSale > 0)) &&
                    <div className='saleInfo mb-3 primary-text'>
                        <p className='title is-5'>
                            {'Mesa: ' + sale.numTable + '  |  '} {/* MOSTRA O NÚMERO DA MESA, SE HOUVER */}
                            {'Cliente: ' + sale.costumerName + '  |  '} {/* MOSTRA O NOME DO CLIENTE, SE HOUVER */}
                            {'Comanda ' + sale.numSale + '\n'} {/* MOSTRA O NÚMERO DA COMANDA, E SÓ É EXIBIDO CASO O CAMPO COMANDA ESTEJA PREENCHIDO */}
                        </p>
                        {sale.orders && sale.orders.map((item: any, index: number) => <p key={index}>{getItemText("numItem", item)}</p>)}
                        {sale.orders?.length > 0 && <p className='mt-3 title is-5'> Total: {sale.totalValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>}
                    </div>
                }

                {Array.isArray(sale) &&
                    <div>
                        <SaleAccordion sale={sale} selectedSale={(selectedSale: sale) => setSale(selectedSale)} selectedIndex={getSelectedIndex} />
                    </div>
                }

                {alert}

                <div className='btn-limpar-centered mt-5'>
                    <Button
                        onClick={updateSales}
                        disabled={Array.isArray(sale) || !sale.numTable ? true : false}
                        text='Salvar'
                        className="is-success"
                    />
                    <Button onClick={clear} disabled={Array.isArray(sale) || sale.numTable ? false : true} text='Limpar' />
                </div>
            </div>
        </>
    )
}