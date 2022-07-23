import React, { useEffect, useState } from 'react'
import './styles.css'
import Button from '../../components/Button/Button'
import ItemsListInput from '../../components/ItemsListInput/ItemsListInput'
import {Accordion, Alert, TextField } from '@mui/material'
import SaleAccordion from '../../components/SaleAccordion/SaleAccordion'

const AddSaleScreen = () => {

    interface sale {
        numTable: Number,
        numSale: Number,
        costumerName: '',
        orders: String[],
        date: String,
        time: String
    }

    const initialSale: sale | any = {
        numTable: 0,
        numSale: 0,
        orders: [],
        date: '',
        time: ''
    }

    const [tableNumber, setTableNumber] = useState(0)
    const [saleNumber, setSaleNumber] = useState(0)
    const [costumerName, setCostumerName] = useState('')
    const [currentOrder, setCurrentOrder] = useState('')
    const [sale, setSale] = useState({ ...initialSale })
    const [alert, setAlert] = useState(<p></p>)
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
            "time": "21:56"
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
            "time": "21:56"
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
            "time": "21:56"
        },
    ])

    const findTable = () => {
        let currentSale: any = []
        sales.forEach((sale) => {
            if (sale.numTable == tableNumber) {
                currentSale.push(sale)
            }
        })
        setSale(currentSale.length == 1 ? (sale: sale) => ({ ...sale, ...currentSale[0] }): currentSale)
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
        let currentCostumer: any= []
        sales.forEach((sale) => {
            if (sale.costumerName.toLowerCase() == costumerName.toLowerCase()) {
                currentCostumer.push(sale)
            }
        })
        setSale(currentCostumer.length == 1 ? (sale: sale) => ({ ...sale, ...currentCostumer[0] }): currentCostumer)
    }

    const setOrder = () => {
        let updatedSale = {
            numTable: sale.numTable,
            numSale: sale.numSale,
            orders: [...sale.orders, currentOrder],
            date: sale.date,
            time: sale.time
        }

        setSale((sale: any) => ({ ...sale, ...updatedSale }))
        setCurrentOrder('')
        setAlert(<Alert severity="success" >Pedido registrado!</Alert>)
    }

    const clear = () => {
        setSale({ ...initialSale })
        setCurrentOrder('')
        setSaleNumber(0)
        setTableNumber(0)
        setCostumerName('')
    }

    useEffect(() => {
        console.log(sale)
    }, [sale])


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
                    disabled={sale.numTable != 0 ? true : false}
                    onClick={saleNumber ? findSale : (tableNumber ? findTable : findCostumer)}
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
                    disabled={sale.numTable == 0 || Array.isArray(sale) ? true : false}
                />
                {
                    ((saleNumber > 0 || costumerName != '' || tableNumber > 0) && !Array.isArray(sale)) &&
                    <div className='saleInfo mb-3'>
                        <p className='title is-5'>
                            {sale.numTable ? 'Mesa: ' + sale.numTable + '  |  ' : ''} {/* MOSTRA O NÚMERO DA MESA, SE HOUVER */}
                            {sale.costumerName ? 'Cliente: ' + sale.costumerName + '  |  ' : ''} {/* MOSTRA O NOME DO CLIENTE, SE HOUVER */}
                            {sale.numSale ? 'Comanda ' + sale.numSale + '\n' : ''} {/* MOSTRA O NÚMERO DA COMANDA, E SÓ É EXIBIDO CASO O CAMPO COMANDA ESTEJA PREENCHIDO */}
                        </p>
                        {sale.orders.map((item: String) => <p>{item}</p>)}
                    </div>
                }

                {Array.isArray(sale) &&
                    <div>
                        <SaleAccordion sale={sale} selectedSale={(selectedSale :sale) => setSale((sale: sale) => ({ ...sale, ...selectedSale }))}/>
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