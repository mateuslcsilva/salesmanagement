import React, { useEffect, useState } from "react";
import './styles.css'

export const OrdinaryInput = (props: any) => {

 return(
    <>
            <div className="ordinary-input-div">
                <input 
                type={`${props.string ? "text" : "number"}`} 
                id={`input${props.label}`} 
                className={`ordinary-input-input ${props.string ? "input-text" : ""}`} 
                autoComplete='off'
                onChange={(e: any) => props.set(e.target.value)}
                value={props.value < 1 ? '' : props.value}
                required 
                
                />
                <label htmlFor={`input${props.label}`} className="ordinary-input-label">{props.label}</label>
            </div>
            </>
    )
}