import React, { useEffect, useState } from 'react'
import './styles.css'
import Button from '../../components/Button/Button'
import ItemsListInput from '../../components/ItemsListInput/ItemsListInput'
import { Accordion, Alert, TextField } from '@mui/material'
import SaleAccordion from '../../components/SaleAccordion/SaleAccordion'
import { sale } from '../../types/sale/sale'
import { salesList } from '../../assets/salesList'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { useOrderContext } from '../../utils/contexts/OrderContext'
import { collection, collectionGroup, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../utils/firebase/firebase'

const AddSaleScreen = () => {

    const [itemList, setItemList] = useState<itemType[]>([])
    const [currentUserId, setCurrentUserId] = useState<string>()
    const [tableNumber, setTableNumber] = useState(12)
    const [saleNumber, setSaleNumber] = useState(0)
    const [costumerName, setCostumerName] = useState('')
    const [currentOrder, setCurrentOrder] = useState('')
    const [sale, setSale] = useState<sale>({} as sale)
    const [alert, setAlert] = useState(<p></p>)
    const [sales, setSales] = useState(salesList)
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
            let text = (itemList[index]?.numItem < 10 ? '0' + itemList[index]?.numItem : itemList[index]?.numItem.toString()) + ' - ' + itemList[index]?.item + ' R$' + itemList[index]?.itemValue
            return text
        }
        if (!itemList[value]) return ''
        if (typeParam == "index") {
            let text = (itemList[value]?.numItem < 10 ? '0' + itemList[value]?.numItem : itemList[value]?.numItem.toString()) + ' - ' + itemList[value]?.item + ' R$' + itemList[value]?.itemValue
            return text
        }
    }

    const findTable = async () => {
       /*  let currentSale :any[] = []
        let docRef = collectionGroup(db, `${AuthContext.currentUser.id}.sales`)
        const saleInfo = await getDocs(query(docRef, where("numTable", "==", tableNumber)))
        .then((res)=> {
            console.log('res ', res.docs.map(item => item.data()))
            res.docs.forEach(item => currentSale.push(item))
        })
        .catch(err => console.log(err.message))
        console.log('current sale', currentSale) */
        let docRef = doc(db, `empresas`, `${AuthContext.currentUser.id}`)
        const currentSale = await getDoc(docRef)
        .then(res => {
            let data = res.data()
            return data?.sales.filter((item :sale) => item.numTable == tableNumber)
        })
        console.log(currentSale)
        /* */

        setSale(currentSale.length == 1 ? (sale: sale) => ({ ...sale, ...currentSale[0] }) : currentSale)
    }

    /* const findSale = () => {

        setSale((sale: sale) => ({ ...sale, ...currentSale }))
    }

    const findCostumer = () => {
        let currentCostumer: any = []
        
        setSale(currentCostumer.length == 1 ? (sale: sale) => ({ ...sale, ...currentCostumer[0] }) : currentCostumer)
    }
 */
    const setOrder = () => {
        let updatedSale = {
            orders: [...sale.orders, currentOrder]
        }

        setSale((sale: any) => ({ ...sale, ...updatedSale }))
        setCurrentOrder('')
        setAlert(<Alert severity="success" >Pedido registrado!</Alert>)
    }

    const clear = () => {
        setSale({} as sale)
        setCurrentOrder('')
        setSaleNumber(0)
        setTableNumber(0)
        setCostumerName('')
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

    useEffect(() => {
        getItems()
    }, [currentUserId])

/*     useEffect(() => {
        findTable()
    },  [AuthContext.currentUser.id]) */


    return (
        <>
            <div className='div' id='div1'>
                <h3 className='title is-3 mt-3'>ACRESCENTAR ITEM</h3>


                <TextField
                    id="outlined-basic"
                    label="Mesa"
                    variant="outlined"
                    size="small"
                    onChange={(e: any) => setTableNumber(isNaN(e.target.value) ? 0 : e.target.value)}
                    value={tableNumber < 1 ? '' : tableNumber}
                    style={{ 'width': '105px' }}
                    className='mr-2'
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
                    label="Comanda"
                    variant="outlined"
                    size="small"
                    onChange={(e: any) => setSaleNumber(isNaN(e.target.value) ? 0 : e.target.value)}
                    value={saleNumber < 1 ? '' : saleNumber}
                    style={{ 'width': '105px' }}
                    className='mr-2'
                    autoFocus
                />

                <Button
                    className='is-info ml-2'
                    disabled={sale.numTable ? true : false}
                    /* onClick={saleNumber ? findSale : (tableNumber ? findTable : findCostumer)} */
                    onClick={findTable}
                    text='Buscar'
                />

                <ItemsListInput
                    className='is-info mt-5'
                    placeholder="00 - Nome do Pedido"
                    onChange={(e: any) => setCurrentOrder(e.target.value)}
                    value={currentOrder}
                    disabled={sale.numTable == 0 || Array.isArray(sale) ? true : false}
                />

                <Button
                    onClick={setOrder}
                    className='is-info mt-5 mb-5'
                    text='Acrescentar item'
                    disabled={!sale.numTable || Array.isArray(sale) ? true : false}
                />
                {
                    ((saleNumber > 0 || costumerName != '' || tableNumber > 0) && !Array.isArray(sale)) &&
                    <div className='saleInfo mb-3'>
                        <p className='title is-5'>
                            {sale.numTable ? 'Mesa: ' + sale.numTable + '  |  ' : ''} {/* MOSTRA O NÚMERO DA MESA, SE HOUVER */}
                            {sale.costumerName ? 'Cliente: ' + sale.costumerName + '  |  ' : ''} {/* MOSTRA O NOME DO CLIENTE, SE HOUVER */}
                            {sale.numSale ? 'Comanda ' + sale.numSale + '\n' : ''} {/* MOSTRA O NÚMERO DA COMANDA, E SÓ É EXIBIDO CASO O CAMPO COMANDA ESTEJA PREENCHIDO */}
                        </p>
                        {sale.orders && sale.orders.map((item: any, index: number) => <p key={index}>{getItemText("numItem", item)}</p>)}
                    </div>
                }

                {Array.isArray(sale) &&
                    <div>
                        <SaleAccordion sale={sale} selectedSale={(selectedSale: sale) => setSale((sale: sale) => ({ ...sale, ...selectedSale }))} />
                    </div>
                }

                {alert}

                <div className='btn-limpar-centered mt-5'>
                    <Button onClick={clear} disabled={sale.numTable == 0 ? true : false} text='Limpar' />
                </div>
            </div>
        </>
    )
}

export default AddSaleScreen