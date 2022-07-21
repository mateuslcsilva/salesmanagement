import React, { useState, useEffect } from 'react'
import './styles.css'
import Button from '../../components/Button/Button'
import InputNumTable from '../../components/InputNumTable/InputNumTable'
import ItemsListInput from '../../components/ItemsListInput/ItemsListInput'


const NewSaleScreen = () => {

    interface sale {
        numTable: Number,
        numSale: Number,
        orders: String[],
        date: String,
        time: String
    }

    const initialSale :sale = {
        numTable: 0,
        numSale: 0,
        orders: [],
        date: '',
        time: ''
    }

    const [tableNumber, setTableNumber] = useState(0)
    const [currentOrder, setCurrentOrder] = useState('')
    const [sale, setSale] = useState({...initialSale})

    const setTable = () => {
        let current = new Date
        let currentDay = current.getDate() .toString().length < 2 ? '0' + current.getDate()  : current.getDate()
        let currentMonth = current.getMonth().toString().length < 2 ? '0' + (current.getMonth() + 1)   : (current.getMonth() + 1)
        let currentDate = currentDay + '/' + currentMonth + '/' + current.getFullYear()
        let currentTime = current.getHours() + ':' + current.getMinutes()
        let updatedSale = {
            numTable: tableNumber,
            numSale: 0,
            orders: [],
            date: currentDate,
            time: currentTime
        }
        setSale(sale => ({...sale, ...updatedSale}))
    }


    const setOrder = () => {
        let updatedSale = {
            numTable: sale.numTable,
            numSale: sale.numSale,
            orders: [...sale.orders, currentOrder],
            date: sale.date,
            time: sale.time
        }

        setSale(sale => ({...sale, ...updatedSale}))
        setCurrentOrder('')
    }

    const clear = () => {
        setSale({...initialSale})
        setCurrentOrder('')
        setTableNumber(0)
    }

    useEffect(() => {
        console.log(sale)
    }, [sale])

    return (
        <>
                <div className='div' id='div1'>
                    <h3 className='title is-3'>ABRIR COMANDA</h3>
                    <InputNumTable 
                    disabled={sale.numTable != 0? true : false} 
                    onChange = {(e : any) => setTableNumber(isNaN(e.target.value)? 0 : e.target.value)} 
                    value={tableNumber < 1 ? '' : tableNumber} 
                    placeholder="33"
                    className='is-info' 
                    />

                    <Button 
                    className='is-info ml-2' 
                    disabled={sale.numTable != 0? true : false} 
                    onClick={setTable} 
                    text='Selecionar Mesa'
                    /><br /><br/>

                    <ItemsListInput 
                    className='is-info' 
                    placeholder="00 - Nome do Pedido"
                    onChange = {(e : any) => setCurrentOrder(e.target.value)}
                    value={currentOrder}
                    disabled = {sale.numTable == 0? true : false} 
                    /><br /><br />

                    <Button 
                    onClick={setOrder} 
                    className='is-info' 
                    text='Acrescentar item' 
                    disabled = {sale.numTable == 0? true : false}
                    /><br /><br />

                    <p id='visualizacao'>{sale.numTable ? 'Mesa ' + sale.numTable + ':\n' : ''}{ sale.orders.map(item => item + '\n')}</p>

                    <p className={'confirmation-text ' + (sale.orders.length > 0?'visible' : 'hidden')} >Pedido registrado!!!</p>

                        <div className='btn-limpar-centered'>
                            <Button onClick={clear} disabled = {sale.numTable == 0? true : false} text='Limpar'/>
                            </div>
                </div>
        </>
    )
}

export default NewSaleScreen