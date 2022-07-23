import React, { useEffect, useState } from 'react'
import './styles.css'
import Button from '../../components/Button/Button'
import InputNumTable from '../../components/InputNumTable/InputNumTable'
import ItemsListInput from '../../components/ItemsListInput/ItemsListInput'
import { TextField } from '@mui/material'
import {toast} from 'react-toastify'

const AddSaleScreen = () => {

    interface sale {
        numTable: Number,
        numSale: Number,
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
            "costumerName": "jose",
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
        let currentSale: any
        sales.forEach((sale) => {
            if (sale.numTable == tableNumber) {
                currentSale = sale
            }
        })
        setSale((sale: sale) => ({ ...sale, ...currentSale }))

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
        let currentCostumer: any
        sales.forEach((sale) => {
            if (sale.costumerName.toLowerCase() == costumerName.toLowerCase()) {
                currentCostumer = sale
            }
        })
        setSale((sale: sale) => ({ ...sale, ...currentCostumer }))
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
        toast.info('Pedido registrado!!')
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
                <h3 className='title is-3'>ACRESCENTAR ITEM</h3>


                <TextField
                    id="outlined-basic"
                    label="Mesa"
                    variant="outlined"
                    size="small"
                    onChange={(e: any) => setTableNumber(isNaN(e.target.value) ? 0 : e.target.value)}
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
                    onClick={saleNumber ? findSale : (tableNumber? findTable : findCostumer)}
                    text='Selecionar Mesa'
                /><br /><br />

                <ItemsListInput
                    className='is-info'
                    placeholder="00 - Nome do Pedido"
                    onChange={(e: any) => setCurrentOrder(e.target.value)}
                    value={currentOrder}
                    disabled={sale.numTable == 0 ? true : false}
                /><br /><br />

                <Button
                    onClick={setOrder}
                    className='is-info'
                    text='Acrescentar item'
                    disabled={sale.numTable == 0 ? true : false}
                /><br /><br />

                <p id='visualizacao'>
                    {sale.numTable ? 'Mesa: ' + sale.numTable + '  |  ' : ''}
                    {sale.costumerName ? 'Cliente: ' + sale.costumerName + '  |  ' : ''}
                    {sale.numSale ? 'Comanda ' + sale.numSale : ''}
                    {'\n'}
                    {sale.orders.map((item: String) => item + '\n')}
                </p>

                <p className={'confirmation-text ' + (sale.orders.length > 0 ? 'visible' : 'hidden')} >Pedido registrado!!!</p>

                <div className='btn-limpar-centered'>
                    <Button onClick={clear} disabled={sale.numTable == 0 ? true : false} text='Limpar' />
                </div>
            </div>
        </>
    )
}

export default AddSaleScreen