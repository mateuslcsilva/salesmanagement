import React, { ReactComponentElement, useEffect, useState } from 'react'
import './styles.css'
import Button from '../../components/Button/Button'
import ItemsListInput from '../../components/ItemsListInput/ItemsListInput'
import {  Alert, TextField } from '@mui/material'
import SaleAccordion from '../../components/SaleAccordion/SaleAccordion'
import { Checkbox } from '@nextui-org/react'
import { sale } from '../../types/sale/sale'

export const UpdateSaleScreen = () => {

    const [tableNumber, setTableNumber] = useState(0)
    const [saleNumber, setSaleNumber] = useState(0)
    const [costumerName, setCostumerName] = useState('')
    const [newTableNumber, setNewTableNumber] = useState(0)
    const [newSaleNumber, setNewSaleNumber] = useState(0)
    const [sale, setSale] = useState<sale>({} as sale)
    const [selected, setSelected] = useState<string[]>([]);
    const [alert, setAlert] = useState(<p></p>)
    const [action, setAction] = useState(0)

    /* const findTable = () => {
        let currentSale: any = []
        sales.forEach((sale) => {
            if (sale.numTable == tableNumber) {
                currentSale.push(sale)
            }
        })
        setSale(currentSale.length == 1 ? (sale: sale) => ({ ...sale, ...currentSale[0] }) : currentSale)
        setAlert(<p></p>)
    }

    const findSale = () => {
        let currentSale: any
        sales.forEach((sale) => {
            if (sale.numSale == saleNumber) {
                currentSale = sale
            }
        })
        setSale((sale: sale) => ({ ...sale, ...currentSale }))
        setAlert(<p></p>)
    }

    const findCostumer = () => {
        let currentCostumer: any = []
        sales.forEach((sale) => {
            if (sale.costumerName.toLowerCase() == costumerName.toLowerCase()) {
                currentCostumer.push(sale)
            }
        })
        setSale(currentCostumer.length == 1 ? (sale: sale) => ({ ...sale, ...currentCostumer[0] }) : currentCostumer)
        setAlert(<p></p>)
    }

    const changeNumTable = () => {
        sale.numTable = newTableNumber
        clear()
        setAlert(<Alert severity="success" className='fading-out'>Pronto, mesa alterada!</Alert>)
    } */

    const deleteItems = () => {
/*         const selectedToNumber: any[] = selected.map(item => Number(item))
        selectedToNumber.reverse()
        let deletedItems :string[] = []
        selectedToNumber.forEach((item) => {
            let deletedItem = sale.orders.splice(item, 1)
            deletedItems = [...deletedItems, ...deletedItem]
        })
        clear()
        setAlert(<Alert severity="success" className='fading-out'>Pronto, pedidos excluídos!</Alert>)
        return deletedItems */
        return
    }

    const transferringOrders = () => {
        /* const deletedItems = deleteItems()
        const currentSale = sales.find(sale => sale.numSale == newSaleNumber)
        if(currentSale) {
            currentSale.orders = [...currentSale?.orders, ...deletedItems]
            setSale((sale: sale) => ({ ...sale, ...currentSale}))
            console.log(currentSale)
        } else{
            let current = new Date
            let currentDay = current.getDate().toString().length < 2 ? '0' + current.getDate() : current.getDate()
            let currentMonth = current.getMonth().toString().length < 2 ? '0' + (current.getMonth() + 1) : (current.getMonth() + 1)
            let currentDate = currentDay + '/' + currentMonth + '/' + current.getFullYear()
            let currentTime = current.getHours() + ':' + current.getMinutes()
            let updatedSale = {
                numTable: 0,
                numSale: newSaleNumber,
                costumerName: '',
                orders: deletedItems,
                date: currentDate,
                time: currentTime
            }
            setSale(sale => ({ ...sale, ...updatedSale }))
            console.log(updatedSale)
        }
        clear()
        setAlert(<Alert severity="success" className='fading-out'>Pronto, pedidos transferidos!</Alert>) */
    }

    const clear = () => {
        setSale({} as sale)
        setSaleNumber(0)
        setTableNumber(0)
        setCostumerName('')
        setAlert(<p></p>)
        setNewTableNumber(0)
        setNewSaleNumber(0)
        setAction(0)
        setSelected([])
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
        
    useEffect(() => {
        console.log(newSaleNumber)
    }, [newSaleNumber])



    return (
        <>
            <div className='div' id='div1'>
                <h3 className='title is-3 mt-3'>ALTERAR PEDIDO</h3>
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
                    disabled={sale.numTable? true : false}
                    /* onClick={saleNumber ? findSale : (tableNumber ? findTable : findCostumer)} */
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
                        {/* {sale.orders && sale.orders.map((item: string, index :number) => <p key={index}>{item}</p>)} */}
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
                        disabled={!sale.numTable|| Array.isArray(sale) || action != 0 ? true : false}
                    />
                    <Button
                        onClick={() => setAction(2)}
                        className='is-info mt-5 mb-5'
                        text='Mudar Mesa'
                        disabled={!sale.numTable|| Array.isArray(sale) || action != 0 ? true : false}
                    />
                    <Button
                        onClick={() => setAction(3)}
                        className='is-info mt-5 mb-5'
                        text='Migrar Pedidos'
                        disabled={!sale.numTable|| Array.isArray(sale) || action != 0 ? true : false}
                    />

                    <Button
                        onClick={() => setAction(4)}
                        className='is-info mt-5 mb-5'
                        text='Excluir Comanda'
                        disabled={!sale.numTable|| Array.isArray(sale) || action != 0 ? true : false}
                    />
                </div>

                <div>

                    {action == 1 &&
                        <div>
                            <Checkbox.Group
                                label="Selecione o pedido a ser excluído:"
                                color="error"
                                value={selected}
                                onChange={setSelected}
                            >
                                {/* {sale.orders.map((order: string, index: number) => <Checkbox value={index.toString()} className={selected.includes(index.toString()) ? 'strike' : ''}>{order}</Checkbox>)} */}
                            </Checkbox.Group>
                            <div className='is-flex is-justify-content-flex-end mt-5 mb-5'>
                                <Button
                                    className='is-danger ml-2 mb-5'
                                    disabled={selected.length < 1 ? true : false}
                                    onClick={deleteItems}
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
                                autoComplete='off'
                                onChange={(e: any) => setNewTableNumber(isNaN(e.target.value) ? 0 : Number(e.target.value))}
                                value={newTableNumber < 1 ? '' : newTableNumber}
                                style={{ 'width': '105px' }}
                                className='mr-2'
                            />
                            <Button
                                className='is-info ml-2 mb-5'
                                disabled={newTableNumber == 0 ? true : false}
                                /* onClick={changeNumTable} */
                                text='Alterar'
                            />
                        </div> 
                    }
                    {action == 3 &&
                        <div className='is-flex is-justify-content-center mb-5 mt-5'>
                            <Checkbox.Group
                                label="Selecione o pedido a ser excluído:"
                                color="error"
                                value={selected}
                                onChange={setSelected}
                            >
                                {/* {sale.orders.map((order: string, index: number) => <Checkbox value={index.toString()} className={selected.includes(index.toString()) ? 'strike' : ''}>{order}</Checkbox>)} */}
                            </Checkbox.Group>
                            <TextField
                                id="outlined-basic"
                                label="Comanda"
                                variant="outlined"
                                size="small"
                                autoComplete='off'
                                onChange={(e: any) => setNewSaleNumber(isNaN(e.target.value) ? 0 : Number(e.target.value))}
                                value={newSaleNumber < 1 ? '' : newSaleNumber}
                                style={{ 'width': '105px' }}
                                className='mr-2'
                            />
                            <Button
                                className='is-info ml-2 mb-5'
                                disabled={newSaleNumber == 0 || selected.length < 1 ? true : false}
                                onClick={transferringOrders}
                                text='Transferir pedidos'
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