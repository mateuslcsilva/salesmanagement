import React, { useEffect, useState } from 'react'
import './styles.css'
import Button from '../../components/Button/Button'
import { Alert } from '@mui/material'
import { Dropdown } from '@nextui-org/react';
import SaleAccordion from '../../components/SaleAccordion/SaleAccordion'
import { sale } from '../../types/sale/sale'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { useOrderContext } from '../../utils/contexts/OrderContext'
import { InputSearchSale } from '../../components/InputSeachSale/InputSearchSale';
import { useSalesContext } from '../../utils/contexts/SalesProvider';
import { useSalesHistoryContext } from '../../utils/contexts/SalesHistoryProvider';
import { useItemListContext } from '../../utils/contexts/ItemsProvider';

export const CheckOutScreen = () => {
    const [currentUserId, setCurrentUserId] = useState<string>()
    const [sale, setSale] = useState<sale | sale[]>({} as sale)
    const [tableNumber, setTableNumber] = useState(0)
    const [saleNumber, setSaleNumber] = useState(0)
    const [costumerName, setCostumerName] = useState('')
    const [alert, setAlert] = useState(<p></p>)
    const [selected, setSelected] = useState<any>('Forma de Pagamento');
    const AuthContext = useAuthContext()
    const orderContext = useOrderContext()
    const SalesContext = useSalesContext()
    const SalesHistoryContext = useSalesHistoryContext()
    const ItemListContext = useItemListContext()

    const paymentMethods = React.useMemo(
        //@ts-ignore
        () => Array.from(selected).join("").replaceAll("_", " "),
        [selected]
    );

    const getPaymentMehods = (e :React.KeyboardEvent<HTMLElement>) => {
        e.preventDefault()
        switch(e.key){
            case "F5":
                setSelected("Visa Crédito")
            break
            case "F6":
                setSelected("Visa Débito")
            break
            case "F7":
                setSelected("Master Crédito")
            break
            case "F8":
                setSelected("Master Débito")
            break
            case "F9":
                setSelected("Dinheiro")
            break
            case "F1":
                closeSale()
            break
        }
    }

    const getItemText = (typeParam: string, value: number | undefined) => {
        if (AuthContext.currentUser.id == '') return
        const itemList = ItemListContext.itemList
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
        let currentSale = SalesContext.sales.filter(sale => sale.numTable == tableNumber)
        if (currentSale.length < 1) {
            clear()
            return setAlert(<Alert severity="warning">Nenhuma comanda encontrada!</Alert>)
        }
        setSale(currentSale.length == 1 ? currentSale[0] : currentSale)
    }

    const findSale = () => {
        let currentSale = SalesContext.sales.filter(sale => sale.numSale == saleNumber)
        if (currentSale.length < 1) {
            clear()
            return setAlert(<Alert severity="warning">Nenhuma comanda encontrada!</Alert>)
        }
        setSale(currentSale[0])
    }

    const findCostumer = () => {
        let currentSale = SalesContext.sales.filter(sale => sale.costumerName?.toLocaleLowerCase().trim() == costumerName.toLocaleLowerCase().trim())
        if (currentSale.length < 1) {
            clear()
            return setAlert(<Alert severity="warning">Nenhuma comanda encontrada!</Alert>)
        }
        setSale(currentSale.length == 1 ? currentSale[0] : currentSale)
    }

    const closeSale = async () => {
        if (Array.isArray(sale)) return
        sale.paymentMethod = paymentMethods
        SalesContext.setSales(sales => sales.filter(remainSale => remainSale.numSale != sale.numSale))
        SalesHistoryContext.setSalesHistory([...SalesHistoryContext.salesHistory, sale])
        clear()
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
        const clearAlert = setTimeout(() => {
            setAlert(<p></p>)
        }, 5000)
        return () => clearTimeout(clearAlert)
    }, [alert])

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

    return (
        <>
            <div className='div' id='div1'
            >
                <h3 className='title is-3 mt-3'>FECHAR COMANDA</h3>
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
                    disabled={Array.isArray(sale) || sale.numSale ? true : false}
                    onClick={saleNumber ? findSale : (tableNumber ? findTable : findCostumer)}
                    text='Buscar'
                />

                {
                    ((!Array.isArray(sale))) && sale && sale.numSale &&
                    <div className='saleInfo mb-3  primary-text'>
                        <p className='title is-5'>
                            {'Mesa: ' + sale.numTable + '  |  '} 
                            {'Cliente: ' + sale.costumerName + '  |  '} 
                            {'Comanda ' + sale.numSale + '\n'} 
                        </p>
                        {sale.orders && sale.orders.map((item: number, index: number) => <p key={index}>{getItemText("numItem", item)}</p>)}
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
                        css={{"color" : "var(--primary-text-color)"}}
                        onKeyDown={(e) => getPaymentMehods(e)}
                        >{paymentMethods}</Dropdown.Button>
                        <Dropdown.Menu
                            aria-label="Static Actions"
                            variant="solid"
                            className='border rounded '
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