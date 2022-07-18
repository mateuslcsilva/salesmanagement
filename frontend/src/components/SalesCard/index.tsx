import { useState, useEffect } from 'react'
import NotificationButton from '../NotificationButton'
import DatePicker from "react-datepicker";
import { BASE_URL } from '../../utils/request';
import { Sale } from "../../models/sale"
import "react-datepicker/dist/react-datepicker.css";
import './styles.css'
import axios from 'axios';


const SalesCard = () => {
    const [minDate, setMinDate] = useState(new Date())
    const [maxDate, setMaxDate] = useState(new Date())
    const [sales, setSales] = useState<Sale[]>([])


    useEffect(() => {

        let min = minDate.toISOString().slice(0, 10)
        let max = maxDate.toISOString().slice(0, 10)
        
        axios.get(`${BASE_URL}/sales?minDate=${min}&maxDate=${max}`)
            .then(response => setSales(response.data.content))
        console.log(sales)
    }, [minDate, maxDate])


    return (
        <>
            <div className="dsmeta-card">
                <h2 className="dsmeta-sales-title">Vendas</h2>
                <div>
                    <div className="dsmeta-form-control-container">
                        <DatePicker
                            selected={minDate}
                            onChange={(date: Date) => { setMinDate(date) }}
                            className="dsmeta-form-control"
                            dateFormat="dd/MM/yyyy"
                        />
                    </div>
                    <div className="dsmeta-form-control-container">
                        <DatePicker
                            selected={maxDate}
                            onChange={(date: Date) => { setMaxDate(date) }}
                            className="dsmeta-form-control"
                            dateFormat="dd/MM/yyyy"
                        />
                    </div>
                </div>

                <div>
                    <table className="dsmeta-sales-table">
                        <thead>
                            <tr>
                                <th className="show992">ID</th>
                                <th className="show576">Data</th>
                                <th>Vendedor</th>
                                <th className="show992">Visitas</th>
                                <th className="show992">Vendas</th>
                                <th>Total</th>
                                <th>Notificar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map(sale => {
                                return (
                                    <tr key={sale.id}>
                                        <td className="show992">{sale.id}</td>
                                        <td className="show576">{new Date(sale.date).toLocaleDateString()}</td>
                                        <td>{sale.sellerName}</td>
                                        <td className="show992">{sale.visited}</td>
                                        <td className="show992">{sale.deals}</td>
                                        <td>R$ {sale.amount.toFixed(2)}</td>
                                        <td>
                                            <div className="dsmeta-red-btn-container">
                                                <NotificationButton saleId={sale.id} />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}

                        </tbody>

                    </table>
                </div>

            </div>
        </>
    )

}

export default SalesCard