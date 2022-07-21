import React, { useEffect, useState } from "react";
import {ItemsList} from '../../assets/ItemsList.js'
import './styles.css'

const ItemsListInput = (props :any) => {
    

    useEffect(() => {
        console.log(ItemsList)
    })

    return(
        <>
            <data>
                <input 
                type="text" 
                className={props.className + ' input'} 
                placeholder={props.placeholder} 
                onChange = {props.onChange} 
                value={props.value}  
                disabled={props.disabled}
                list='itemList' 
                />
                </data>

            <datalist id='itemList'>
                {ItemsList.map((item :any, index: number) :any=> {
 
                    console.log((item.numItem < 10? '0' + item.numItem  : item.numItem.toString()) + ' - ' + item.item + ' R$' + item.itemValue)
                    return(
                        <option key={index}>{(item.numItem < 10? '0' + item.numItem  : item.numItem.toString()) + ' - ' + item.item + ' R$' + item.itemValue}</option>
                    )
                })}
                        </datalist>
        </>
    )
}

export default ItemsListInput

