import React from "react";
import './styles.css'

const Button = (props :any) => {


    return(
        <button 
        className= {props.className + ' button' }
        onClick={props.onClick}
        disabled={props.disabled? true : false}
        style={props.style}
        >{props.text}</button>
    )
}

export default Button