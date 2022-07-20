import React, { useState, useEffect } from 'react'
import './styles.css'


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
                    <input disabled={sale.numTable != 0? true : false}name="mesa" id="mesa" className='input is-info' placeholder="33" onChange = {(e : any) => setTableNumber(isNaN(e.target.value)? 0 : e.target.value)} value={tableNumber < 1 ? '' : tableNumber}/>
                    <input disabled={sale.numTable != 0? true : false}type="button" value="Selecionar Mesa" onClick={setTable} className='button is-info ml-2' id='btnmesa' /><br /><br />
                    <data><input type="text" id='pedido' className='input is-info' placeholder="00 - Nome do Pedido" list='listadepedidos' onChange = {(e : any) => setCurrentOrder(e.target.value)} value={currentOrder}  /></data><br /><br />
                    <input type="button" onClick={setOrder} className='button is-info' value='Acrescentar pedido' id='btnAcrescentar' disabled = {sale.numTable == 0? true : false} /><br /><br />
                    <p id='visualizacao'>{sale.orders.map(item => item + '\n')}</p>
                    <p className={'confirmation-text ' + (sale.orders.length > 0?'visible' : 'hidden')} >Pedido registrado!!!</p>
                        <div className='btn-limpar-centered'><button className='button' onClick={clear}  id='btnlimpar' disabled = {sale.numTable == 0? true : false} >Limpar</button></div>
                        <datalist id='listadepedidos'>
                            <option>01 - Porção de Asinha R$29.90</option>
                            <option>02 - Coca 350ml R$6.50</option>
                            <option>03 - Coca 2L R$12.00</option>
                            <option>04 - Porção Batata R$29.90</option>
                            <option>05 - Porção Alcatra R$49.90</option>
                            <option>06 - Devassa 600ml R$9.90</option>
                            <option>07 - Devassa Litrão R$12.50</option>
                            <option>08 - Heineken LongNeck R$8.00</option>
                            <option>09 - Heineken 600ml R$12.90</option>
                            <option>10 - Água R$6.00</option>
                        </datalist>
                </div>
        </>
    )
}

export default NewSaleScreen