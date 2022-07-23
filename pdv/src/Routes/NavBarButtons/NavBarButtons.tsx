import React, { useState } from "react";
import {Link} from 'react-router-dom'
import './styles.css'
import Button from '../../components/Button/Button'

const NavBarButtons = () => {

    const [isOutlined, setIsOutlined] = useState(0)

    return ( 
   <>
        <div className='btns'>
            <Link to="/newsalescreen"><button className={(isOutlined != 1? '' : 'active ') + (isOutlined -1 == 1? 'rounded-left' : '') + ' btnselect '} onClick={() => setIsOutlined(1)}> NOVA MESA</button></Link>
            <Link to="/addsalescreen"><button  className={(isOutlined != 2? '' : 'active ') + (isOutlined + 1 == 2? 'rounded-right' : '') + (isOutlined -1 == 2? 'rounded-left' : '') + ' btnselect '} onClick={() => setIsOutlined(2)}>ACRESCENTAR ITEM</button></Link>
            <Link to="/updatesalescreen"><button className={(isOutlined != 3? '' : 'active ') + (isOutlined + 1 == 3? 'rounded-right' : '') + (isOutlined -1 == 3? 'rounded-left' : '') + ' btnselect '} onClick={() => setIsOutlined(3)}>ALTERAR PEDIDO</button></Link>
            <Link to="/checkoutscreen"><button  className={(isOutlined != 4? '' : 'active ') + (isOutlined + 1 == 4? 'rounded-right' : '') + ' btnselect '} onClick={() => setIsOutlined(4)}>FECHAR COMANDA</button></Link>
        </div>
    </>
    ) 
}

export default NavBarButtons