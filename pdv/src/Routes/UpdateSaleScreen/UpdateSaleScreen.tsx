import React, { ReactComponentElement, useEffect, useState } from 'react'
import './styles.css'
import Button from '../../components/Button/Button'
import ItemsListInput from '../../components/ItemsListInput/ItemsListInput'
import { Accordion, Alert, TextField } from '@mui/material'
import SaleAccordion from '../../components/SaleAccordion/SaleAccordion'
import { Checkbox } from '@nextui-org/react'

const AddSaleScreen = () => {


    interface sale {
        numTable: Number,
        numSale: Number,
        costumerName: String,
        orders: string[],
        date: String,
        time: String,
        closed: boolean,
        paymentMethod: String
    }

    const initialSale: sale = {
        numTable: 0,
        numSale: 0,
        costumerName: '',
        orders: [],
        date: '',
        time: '',
        closed: false,
        paymentMethod: ''
    }

    const [tableNumber, setTableNumber] = useState(0)
    const [saleNumber, setSaleNumber] = useState(0)
    const [costumerName, setCostumerName] = useState('')
    const [newTableNumber, setNewTableNumber] = useState(0)
    const [currentOrder, setCurrentOrder] = useState('')
    const [sale, setSale] = useState({ ...initialSale })
    const [selected, setSelected] = useState(sale.orders);
    const [alert, setAlert] = useState(<p></p>)
    const [action, setAction] = useState(0)
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
            "closed": false,
            "paymentMethod": ''
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
            "closed": false,
            "paymentMethod": ''
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
            "closed": false,
            "paymentMethod": ''
        },
    ])

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

    const changeNumTable = () => {
        sale.numTable = newTableNumber
        clear()
        setAlert(<Alert severity="success" className='fading-out'>Pronto, mesa alterada!</Alert>)
    }

    const clear = () => {
        setSale({ ...initialSale })
        setCurrentOrder('')
        setSaleNumber(0)
        setTableNumber(0)
        setCostumerName('')
        setAlert(<p></p>)
        setNewTableNumber(0)
        setAction(0)
    }

    useEffect(() => {
        const clearAlert = setTimeout(() => {
                setAlert(<p></p>)
            }, 5000)

        return () => clearTimeout(clearAlert)
    })

    useEffect(() => {
        console.log(sale)
    }, [sale])


    return (
        <>
            <div className='div' id='div1'>
                <h3 className='title is-3 mt-3'>ALTERAR PEDIDO</h3>
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


                {alert}

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
                        <SaleAccordion sale={sale} selectedSale={(selectedSale: sale) => setSale((sale: sale) => ({ ...sale, ...selectedSale }))} />
                    </div>
                }

                <div className='is-flex is-justify-content-space-evenly mt-5'>
                    <Button
                        onClick={() => setAction(1)}
                        className='is-info mt-5 mb-5'
                        text='Excluir Pedido'
                        disabled={sale.numTable == 0 || Array.isArray(sale) ? true : false}
                    />
                    <Button
                        onClick={() => setAction(2)}
                        className='is-info mt-5 mb-5'
                        text='Mudar Mesa'
                        disabled={sale.numTable == 0 || Array.isArray(sale) ? true : false}
                    />
                    <Button
                        onClick={() => setAction(3)}
                        className='is-info mt-5 mb-5'
                        text='Migrar Pedidos'
                        disabled={sale.numTable == 0 || Array.isArray(sale) ? true : false}
                    />

                    <Button
                        onClick={() => setAction(4)}
                        className='is-info mt-5 mb-5'
                        text='Excluir Comanda'
                        disabled={sale.numTable == 0 || Array.isArray(sale) ? true : false}
                    />
                </div>

                <div>

                    {action == 1 &&
                        <div>
                            <Checkbox.Group
                                label="Selecione o pedido a ser excluído:"
                                color="secondary"
                                value={selected}
                                onChange={setSelected}
                            >
                                {sale.orders.map((order :string, index :number) => <Checkbox value={order + index}><span className={selected.includes(order) ? 'strike' : ''}>{order}</span></Checkbox>)}
                            </Checkbox.Group>
                            <div className='is-flex is-justify-content-flex-end mt-5 mb-5'>
                                <Button
                                    className='is-danger ml-2 mb-5'
                                    disabled={selected.length < 1 ? true : false}
                                    onClick={saleNumber ? findSale : (tableNumber ? findTable : findCostumer)}
                                    text='Excluir pedido'
                                />
                            </div>
                        </div>
                    }
                    {action == 2 &&
                        <div className='is-flex is-justify-content-center mb-5 mt-5'>
                            <TextField
                                id="outlined-basic"
                                label="Mesa"
                                variant="outlined"
                                size="small"
                                onChange={(e: any) => setNewTableNumber(isNaN(e.target.value) ? 0 : Number(e.target.value))}
                                value={newTableNumber < 1 ? '' :newTableNumber}
                                style={{ 'width': '105px' }}
                                className='mr-2'
                            />
                            <Button
                                className='is-info ml-2 mb-5'
                                disabled={newTableNumber == 0 ? true : false}
                                onClick={changeNumTable}
                                text='Alterar'
                            />
                        </div>
                        }



                </div>

                <div className='btn-limpar-centered mt-5'>
                    <Button onClick={clear} disabled={(sale.numTable == 0 || Array.isArray(sale)) ? true : false} text='Limpar' />
                </div>
            </div>
        </>
    )
}

export default AddSaleScreen