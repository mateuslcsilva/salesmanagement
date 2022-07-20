import React from "react";
import './styles.css'

const NavBarButtons = () => {
   
    return ( 
   <>
        <div className='btns'>

            <button className='button is-info  btnselect'  >NOVA MESA</button>
            <button className='button is-info is-outlined btnselect'  >ACRESCENTAR PEDIDO</button>
            <button className='button is-info is-outlined btnselect'  >ALTERAR PEDIDO</button>
            <button className='button is-info is-outlined btnselect'  > FECHAR COMANDA</button>

        </div>
    </>
    )
}

export default NavBarButtons