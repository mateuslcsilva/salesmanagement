import React, { useState, useEffect } from 'react'
import './styles.css'
import { Alert, TextField } from '@mui/material'
import Button from '../../components/Button/Button'
import ItemsListInput from '../../components/ItemsListInput/ItemsListInput'
import { sale } from '../../types/sale/sale'

const NewSaleScreen = () => {

    const [tableNumber, setTableNumber] = useState(0)
    const [saleNumber, setSaleNumber] = useState(0)
    const [costumerName, setCostumerName] = useState('')
    const [currentOrder, setCurrentOrder] = useState('')
    const [alert, setAlert] = useState(<p></p>)
    const [sale, setSale] = useState<sale>({} as sale)

    const setTable = () => {
        let current = new Date
        let currentDay = current.getDate().toString().length < 2 ? '0' + current.getDate() : current.getDate()
        let currentMonth = current.getMonth().toString().length < 2 ? '0' + (current.getMonth() + 1) : (current.getMonth() + 1)
        let currentDate = currentDay + '/' + currentMonth + '/' + current.getFullYear()
        let currentTime = current.getHours() + ':' + current.getMinutes()
        let updatedSale = {
            numTable: tableNumber,
            numSale: saleNumber,
            costumerName: costumerName,
            orders: [],
            date: currentDate,
            time: currentTime
        }
        setSale(sale => ({ ...sale, ...updatedSale }))
    }

    const setOrder = () => {
        let updatedSale = {
            orders: [...sale.orders, currentOrder],
        }

        setSale(sale => ({ ...sale, ...updatedSale }))
        setAlert(<Alert severity="success" >Pedido registrado!</Alert>)
        setCurrentOrder('')
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

    return (
        <>
            <div className='div' id='div1'>
                <h3 className='title is-3 mt-3'>ABRIR COMANDA</h3>
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
                    label="Comanda*"
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
                    disabled={sale.numSale? true : false}
                    onClick={setTable}
                    text='Iniciar comanda'
                />

                <ItemsListInput
                    className='is-info mb-5'
                    placeholder="00 - Nome do Pedido"
                    onChange={(e: any) => setCurrentOrder(e.target.value)}
                    value={currentOrder}
                    disabled={sale.numSale == 0 ? true : false}
                />

                <Button
                    onClick={setOrder}
                    className='is-info mb-5'
                    text='Acrescentar item'
                    disabled={!sale.numSale? true : false}
                />
                {saleNumber > 0 &&
                    <div className='saleInfo mb-3'>
                        <p className='title is-5'>
                        {sale.numTable ? 'Mesa: ' + sale.numTable + '  |  ' : ''} {/* MOSTRA O NÚMERO DA MESA, SE HOUVER */}
                        {sale.costumerName ? 'Cliente: ' + sale.costumerName + '  |  ' : ''} {/* MOSTRA O NOME DO CLIENTE, SE HOUVER */}
                        {sale.numSale ? 'Comanda ' + sale.numSale + '\n' : ''} {/* MOSTRA O NÚMERO DA COMANDA, E SÓ É EXIBIDO CASO O CAMPO COMANDA ESTEJA PREENCHIDO */}
                        </p>
                       {sale.orders && sale.orders.map((item :any, index :number) => <p key={index}>{item}</p>)}
                    </div>
                }

                {alert}
                
                <div className='btn-limpar-centered mt-5'>
                    <Button onClick={clear} disabled={sale.numSale == 0 ? true : false} text='Limpar' />
                </div>
            </div>
        </>
    )
}

export default NewSaleScreen