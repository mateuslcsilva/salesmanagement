import React, { useEffect, useState } from 'react'
import './styles.css'
import Button from '../../components/Button/Button'
import {ItemsList} from '../../assets/ItemsList'
import { Alert, TextField } from '@mui/material'
import { Dropdown } from '@nextui-org/react';
import SaleAccordion from '../../components/SaleAccordion/SaleAccordion'

const AddSaleScreen = () => {

    interface sale {
        numTable: Number,
        numSale: Number,
        costumerName: '',
        orders: String[],
        date: String,
        time: String,
        closed: boolean
    }

    const initialSale: sale | any = {
        numTable: 0,
        numSale: 0,
        orders: [],
        date: '',
        time: '',
        closed: false
    }

    const [tableNumber, setTableNumber] = useState(0)
    const [saleNumber, setSaleNumber] = useState(0)
    const [costumerName, setCostumerName] = useState('')
    const [currentOrder, setCurrentOrder] = useState('')
    const [sale, setSale] = useState({ ...initialSale })
    const [totalValue, setTotalValue] = useState('')
    const [alert, setAlert] = useState(<Alert severity="success" >Pronto, comanda fechada!</Alert>)
    const [selected, setSelected] = React.useState('Forma de Pagamento');
    const [sales, setSales] = useState([
        {
            "id": 1,
            "numSale": 12,
            "numTable": 1,
            "costumerName": "carlos",
            "orders": [
                "05 - Porção Alcatra R$49.90",
                "06 - Devassa 600ml R$9.90",
                "06 - Devassa 600ml R$9.90",
                "09 - Heineken 600ml R$12.90"
            ],
            "date": "21/07/2022",
            "time": "21:56",
            "closed": false
        },
        {
            "id": 2,
            "numSale": 13,
            "numTable": 2,
            "costumerName": "Carlos",
            "orders": [
                "05 - Porção Alcatra R$49.90",
                "06 - Devassa 600ml R$9.90",
                "06 - Devassa 600ml R$9.90",
                "09 - Heineken 600ml R$12.90"
            ],
            "date": "21/07/2022",
            "time": "21:56",
            "closed": false
        },
        {
            "id": 3,
            "numSale": 14,
            "numTable": 1,
            "costumerName": "joao",
            "orders": [
                "05 - Porção Alcatra R$49.90",
                "06 - Devassa 600ml R$9.90",
                "06 - Devassa 600ml R$9.90",
                "09 - Heineken 600ml R$12.90"
            ],
            "date": "21/07/2022",
            "time": "21:56",
            "closed": false
        },
    ])

    const paymentMethods = React.useMemo(
        () => Array.from(selected).join("").replaceAll("_", " "),
        [selected]
    );


    const findTable = () => {
        let currentSale: any = []
        sales.forEach((sale) => {
            if (sale.numTable == tableNumber) {
                currentSale.push(sale)
            }
        })
        setSale(currentSale.length == 1 ? (sale: sale) => ({ ...sale, ...currentSale[0] }) : currentSale)
    }

    const findSale = () => {
        let currentSale: any
        sales.forEach((sale) => {
            if (sale.numSale == saleNumber) {
                currentSale = sale
            }
        })
        setSale((sale: sale) => ({ ...sale, ...currentSale }))
    }

    const findCostumer = () => {
        let currentCostumer: any = []
        sales.forEach((sale) => {
            if (sale.costumerName.toLowerCase() == costumerName.toLowerCase()) {
                currentCostumer.push(sale)
            }
        })
        setSale(currentCostumer.length == 1 ? (sale: sale) => ({ ...sale, ...currentCostumer[0] }) : currentCostumer)
    }

    const getTotalValue = () => {
        if (Array.isArray(sale)) return
        const itemsId :number[] = sale.orders.map((order :string) => Number(order.substring(0,2)))
        let total :number = 0
        itemsId.forEach((order :number) => {
            ItemsList.forEach((item :any)=> {
                    item.numItem == order? total += Number(item.itemValue) : {}
            })
        })
        setTotalValue(total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}))
        console.log(totalValue)
    }

    const closeSale = () => {
        let updatedSale = {
            numTable: sale.numTable,
            numSale: sale.numSale,
            orders: [...sale.orders, currentOrder],
            date: sale.date,
            time: sale.time,
            closed: true
        }

        setSale((sale: any) => ({ ...sale, ...updatedSale }))
        setCurrentOrder('')
    }

    const clear = () => {
        setSale({ ...initialSale })
        setCurrentOrder('')
        setSaleNumber(0)
        setTableNumber(0)
        setCostumerName('')
    }




    useEffect(() => {
        getTotalValue()
    }, [sale])

    useEffect(() => {
        console.log(sale.closed)
    }, [sale.closed])


    return (
        <>
            <div className='div' id='div1'>
                <h3 className='title is-3 mt-3'>FECHAR COMANDA</h3>


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
                    className='is-info ml-2 mb-5'
                    disabled={sale.numTable != 0 ? true : false}
                    onClick={saleNumber ? findSale : (tableNumber ? findTable : findCostumer)}
                    text='Buscar'
                />


                {
                    ((saleNumber > 0 || costumerName != '' || tableNumber > 0) && !Array.isArray(sale) && !sale.closed) &&
                    <div className='saleInfo mb-3'>
                        <p className='title is-5'>
                            {sale.numTable ? 'Mesa: ' + sale.numTable + '  |  ' : ''} {/* MOSTRA O NÚMERO DA MESA, SE HOUVER */}
                            {sale.costumerName ? 'Cliente: ' + sale.costumerName + '  |  ' : ''} {/* MOSTRA O NOME DO CLIENTE, SE HOUVER */}
                            {sale.numSale ? 'Comanda ' + sale.numSale + '\n' : ''} {/* MOSTRA O NÚMERO DA COMANDA, E SÓ É EXIBIDO CASO O CAMPO COMANDA ESTEJA PREENCHIDO */}
                        </p>
                        {sale.orders.map((item: String) => <p>{item}</p>)}
                        <p className='mt-3 title is-5'> Total: {totalValue}</p>
                    </div>
                }


                {Array.isArray(sale) &&
                    <div>
                        <SaleAccordion sale={sale} selectedSale={(selectedSale: sale) => setSale((sale: sale) => ({ ...sale, ...selectedSale }))} />
                    </div>
                }

                {sale.closed && alert}

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
                            <Dropdown.Item key="Dinheiro" color="default">
                                Dinheiro
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Button
                        onClick={closeSale}
                        className='is-success ml-3'
                        text='PAGO!'
                        disabled={sale.numTable == 0 || Array.isArray(sale) || (paymentMethods == "Forma de Pagamento" )? true : false}
                    />
                </div>

                <div className='btn-limpar-centered mt-5'>
                    <Button onClick={clear} disabled={sale.numTable == 0 ? true : false} text='Limpar' />
                </div>
            </div>
        </>
    )
}

export default AddSaleScreen