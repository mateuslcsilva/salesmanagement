import React, { useState } from "react";
import {Link} from 'react-router-dom'
import './styles.css'

const NavBarButtons = () => {

    const [isActive, setIsActive] = useState(1)

    return ( 
   <>
        <div className='btns'>
            <Link to="/newsalescreen"><button className={(isActive != 1? '' : 'active ') + (isActive -1 == 1? 'rounded-left' : '') + ' btnselect'} onClick={() => setIsActive(1)}> ABRIR COMANDA</button></Link>
            <Link to="/addsalescreen"><button  className={(isActive != 2? '' : 'active ') + (isActive + 1 == 2? 'rounded-right' : '') + (isActive -1 == 2? 'rounded-left' : '') + ' btnselect '} onClick={() => setIsActive(2)}>ACRESCENTAR ITEM</button></Link>
            <Link to="/updatesalescreen"><button className={(isActive != 3? '' : 'active ') + (isActive + 1 == 3? 'rounded-right' : '') + (isActive -1 == 3? 'rounded-left' : '') + ' btnselect '} onClick={() => setIsActive(3)}>ALTERAR PEDIDO</button></Link>
            <Link to="/checkoutscreen"><button  className={(isActive != 4? '' : 'active ') + (isActive + 1 == 4? 'rounded-right' : '') + (isActive -1 == 4? 'rounded-left' : '') + ' btnselect '} onClick={() => setIsActive(4)}>FECHAR COMANDA</button></Link>
            
        </div>
    </>
    ) 
}

export default NavBarButtons