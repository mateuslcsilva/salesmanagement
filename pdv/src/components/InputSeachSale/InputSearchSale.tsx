import React, { useEffect, useState } from "react";
import './styles.css'

export const InputSearchSale = (props: any) => {
    const [sale, setSale] = useState(props.sale)

 return(
    <>
            <div className="search-sale-div">
                <input 
                type={`${props.string ? "text" : "number"}`} 
                id={`input${props.label}`} 
                className={`search-sale-input ${props.string ? "" : "align-right"}`} 
                autoComplete='off'
                disabled={!props.nonDisabled && (Array.isArray(props.sale) || props.sale.numSale) ? true : false}
                onChange={!props.string ? (e: any) => props.set(isNaN(e.target.value) ? 0 : e.target.value) : (e: any) => props.set(e.target.value)}
                value={props.value < 1 ? '' : props.value}
                required 
                
                />
                <label htmlFor={`input${props.label}`} className="search-sale-label">{props.label}</label>
            </div>
            </>
    )
}