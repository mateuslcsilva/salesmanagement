import React from "react";
import './styles.css'

const InputNumTable = (props :any) => {
    return(
        <input disabled={props.disabled} className={props.className + ' input' } placeholder={props.placeholder} onChange = {props.onChange} value={props.value} id='mesa'/>
    )
}

export default InputNumTable