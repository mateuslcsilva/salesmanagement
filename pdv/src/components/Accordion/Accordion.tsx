import React, { useState } from 'react'
import './styles.css'
import { itemType } from '../../types/itemType/itemType'

export const Accordion = (props :any) => {
    const [open, setOpen] = useState(false)

    const getItemText = (typeParam: string, value: number | undefined) => {
        if (props.AuthContext.currentUser.id == '') return
        if (!value) return
        if (typeParam == "numItem") {
            let index = props.itemList.findIndex((item :itemType) => item.numItem == value)
            //@ts-ignore
            let text = (props.itemList[index]?.numItem < 10 ? '0' + props.itemList[index]?.numItem : props.itemList[index]?.numItem.toString()) + ' - ' + props.itemList[index]?.item + '- ' + props.itemList[index]?.itemValue.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
            return text
        }
        if (!props.itemList[value]) return ''
        if (typeParam == "index") {
          //@ts-ignore
            let text = (props.itemList[value]?.numItem < 10 ? '0' + props.itemList[value]?.numItem : props.itemList[value]?.numItem.toString()) + ' - ' + props.itemList[value]?.item + ' - ' + props.itemList[value]?.itemValue.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
            return text
        }
    }

    return(
            <div className='accordion' style={open ? {"height": `${120 + props.sale.orders?.length * 24}px`}: {}}>
                <div className='accordion-title' onClick={() => setOpen(open => !open)}>
                    <p>Mesa: {props.sale.numTable}</p> 
                    <p>Comanda: {props.sale.numSale}</p>
                    <p>Nome: {props.sale.costumerName}</p>
                    <i className={`bi bi-chevron-down ${open ? "turn-up" : ""}`}></i>
                </div>
                <div className="accordion-body">
                    {props.sale.orders?.map((order :number) => <p>{getItemText("numItem", order)}</p>)

                    }
                    <p className='sale-date'>Data da venda: <span>{props.sale.date}</span></p>
                    <h4 className="accordion-footer">Total: {props.sale.totalValue?.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</h4>
                </div>
            </div>
    )
}