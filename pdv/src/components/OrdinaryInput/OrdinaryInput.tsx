import React, { useEffect, useState } from "react";
import './styles.css'

export const OrdinaryInput = (props: any) => {

 return(
    <>
            <div className="ordinary-input-div">
                <input 
                type={`${props.string || props.password || "number"}`} 
                id={`input${props.label}_`} 
                className={`ordinary-input-input 
                ${props.large ? "input-large" : ""} 
                ${props.string || props.password? "input-text" : ""}
                ${props.invalid || props.invalidPassword ? "invalid-input" : ""}
                `} 
                autoComplete='off'
                onChange={props.handleChange}
                value={!props.string && props.value < 1 ? '' : props.value}
                name={props.name}
                required 
                />
                <label htmlFor={`input${props.label}_`} className="ordinary-input-label">{props.label}</label>
                {props.invalid && 
                    <p id="invalid-email-alert">*Email invalido!</p>
                }
                {props.invalidPassword && 
                    <p id="invalid-password-alert">*Senha muito curta!</p>
                }
            </div>
            </>
    )
}