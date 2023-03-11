import React, { useEffect, useState } from 'react'
import './styles.css'
import Button from '../../components/Button/Button'
import { Alert, TextField } from '@mui/material'
import { Dropdown } from '@nextui-org/react';
import SaleAccordion from '../../components/SaleAccordion/SaleAccordion'
import { sale } from '../../types/sale/sale'
import { arrayRemove, arrayUnion, doc, FieldValue, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase/firebase'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { useOrderContext } from '../../utils/contexts/OrderContext'
import { queryData } from '../../utils/requests/queryData'

export const CheckOutScreen = () => {

    const [itemList, setItemList] = useState<Array<itemType>>([])
    const [currentUserId, setCurrentUserId] = useState<string>()
    const [saleIndex, setSaleIndex] = useState<number[] | number>()
    const [sale, setSale] = useState<sale | sale[]>({} as sale)
    const [sales, setSales] = useState<Array<sale>>([] as Array<sale>)
    const [salesHistory, setSalesHistory] = useState<Array<sale>>()
    const [tableNumber, setTableNumber] = useState(0)
    const [saleNumber, setSaleNumber] = useState(0)
    const [costumerName, setCostumerName] = useState('')
    const [alert, setAlert] = useState(<p></p>)
    const [selected, setSelected] = useState<any>('Forma de Pagamento');
    const AuthContext = useAuthContext()
    const orderContext = useOrderContext()

    const paymentMethods = React.useMemo(
        () => Array.from(selected).join("").replaceAll("_", " "),
        [selected]
    );

    interface itemType {
        numItem: number;
        item: string;
        itemValue: string
    }

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

    const findTable = () => {
        let currentSale = sales.filter(sale => sale.numTable == tableNumber)
        if (currentSale.length < 1) return setAlert(<Alert severity="warning">Nenhuma comanda encontrada!</Alert>)
        setSale(currentSale.length == 1 ? currentSale[0] : currentSale)
    }

    const findSale = () => {
        let currentSale = sales.filter(sale => sale.numSale == saleNumber)
        if (currentSale.length < 1) return setAlert(<Alert severity="warning">Nenhuma comanda encontrada!</Alert>)
        setSale(currentSale[0])
    }

    const findCostumer = () => {
        let currentSale = sales.filter(sale => sale.costumerName?.toLocaleLowerCase().trim() == costumerName.toLocaleLowerCase().trim())
        if (currentSale.length < 1) return setAlert(<Alert severity="warning">Nenhuma comanda encontrada!</Alert>)
        setSale(currentSale.length == 1 ? currentSale[0] : currentSale)
    }

    const closeSale = async () => {
        if (Array.isArray(sale) || typeof salesHistory == "undefined") return
        sale.paymentMethod = paymentMethods
        await updateDoc(doc(db, "empresas", `${AuthContext.currentUser.id}`), {
            sales: sales.filter(sale2 => sale2.numSale !== sale.numSale),
            salesHistory: arrayUnion(sale)
        }).then(res => {
            getItems()
            clear()
        }
        )
        .catch(err => console.log("Erro ao subir informações: ", err.message))
    }

    const clear = () => {
        setSale({} as sale)
        setSaleNumber(0)
        setTableNumber(0)
        setCostumerName('')
        setSelected('Forma de Pagamento')
        setAlert(<p></p>)
    }

    useEffect(() => {
        console.log(sale)
    }, [sale])

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
    }, [])

    return (
        <>
            <div className='div' id='div1'>
                <h3 className='title is-3 mt-3'>FECHAR COMANDA</h3>
                <TextField
                    id="outlined-basic"
                    label="Mesa"
                    variant="outlined"
                    size="small"
                    autoComplete='off'
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
                    autoComplete='off'
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
                    autoComplete='off'
                    onChange={(e: any) => setSaleNumber(isNaN(e.target.value) ? 0 : e.target.value)}
                    value={saleNumber < 1 ? '' : saleNumber}
                    style={{ 'width': '105px' }}
                    className='mr-2'
                    autoFocus
                />

                <Button
                    className='is-info ml-2 mb-5'
                    disabled={Array.isArray(sale) || sale.numSale ? true : false}
                    onClick={saleNumber ? findSale : (tableNumber ? findTable : findCostumer)}
                    text='Buscar'
                />

                {
                    ((!Array.isArray(sale))) && sale && sale.numSale &&
                    <div className='saleInfo mb-3'>
                        <p className='title is-5'>
                            {sale.numTable ? 'Mesa: ' + sale.numTable + '  |  ' : ''} {/* MOSTRA O NÚMERO DA MESA, SE HOUVER */}
                            {sale.costumerName ? 'Cliente: ' + sale.costumerName + '  |  ' : ''} {/* MOSTRA O NOME DO CLIENTE, SE HOUVER */}
                            {sale.numSale ? 'Comanda ' + sale.numSale + '\n' : ''} {/* MOSTRA O NÚMERO DA COMANDA, E SÓ É EXIBIDO CASO O CAMPO COMANDA ESTEJA PREENCHIDO */}
                        </p>
                        {sale.orders && sale.orders.map((item: any, index: number) => <p key={index}>{getItemText("numItem", item)}</p>)}
                        <p className='mt-3 title is-5'> Total: {sale.totalValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</p>
                    </div>
                }


                {Array.isArray(sale) &&
                    <div>
                        <SaleAccordion sale={sale} selectedSale={(selectedSale: sale) => setSale(selectedSale)} />
                    </div>
                }

                {alert}

                <div className='is-flex is-justify-content-flex-end mt-5 mb-5'>

                    <Dropdown>
                        <Dropdown.Button
                            light
                        >{paymentMethods}</Dropdown.Button>
                        <Dropdown.Menu
                            aria-label="Static Actions"
                            variant="solid"
                            className='border rounded text-bg-light'
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={selected}
                            onSelectionChange={setSelected}
                        >
                            <Dropdown.Item key="Visa Crédito" color='default'>Visa Crédito</Dropdown.Item>
                            <Dropdown.Item key="Visa Débito" color='default'>Visa Débito</Dropdown.Item>
                            <Dropdown.Item key="Master Crédito" color='default'>Master Crédito</Dropdown.Item>
                            <Dropdown.Item key="Master Débito" color='default'>Master Débito</Dropdown.Item>
                            <Dropdown.Item key="Dinheiro" color="default">Dinheiro</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Button
                        onClick={closeSale}
                        className='is-success ml-3'
                        text='PAGO!'
                        disabled={Array.isArray(sale) || !sale.numTable || (paymentMethods == "Forma de Pagamento") ? true : false}
                    />
                </div>

                <div className='btn-limpar-centered mt-5'>
                    <Button onClick={clear} disabled={Array.isArray(sale) || sale.numTable ? false : true} text='Limpar' />
                </div>
            </div>
        </>
    )
}