import React, { useState } from "react";
import {Link} from 'react-router-dom'
import './styles.css'
import Button from '../../components/Button/Button'

const NavBarButtons = () => {

    const [isOutlined, setIsOutlined] = useState(0)

    return ( 
   <>
        <div className='btns'>
            <Link to="/newsalescreen"><Button text='NOVA MESA' className={(isOutlined == 1? '' : 'is-outlined') + ' btnselect is-info'} onClick={() => setIsOutlined(1)}/></Link>
            <Link to="/addsalescreen"><Button text='ACRESCENTAR PEDIDO' className={(isOutlined == 2? '' : 'is-outlined') + ' btnselect is-info'} onClick={() => setIsOutlined(2)}/></Link>
            <Link to="/updatesalescreen"><Button text='ALTERAR PEDIDO' className={(isOutlined == 3? '' : 'is-outlined') + ' btnselect is-info'} onClick={() => setIsOutlined(3)}/></Link>
            <Link to="/checkoutscreen"><Button text='FECHAR COMANDA<' className={(isOutlined == 4? '' : 'is-outlined') + ' btnselect is-info'} onClick={() => setIsOutlined(4)}/></Link>
        </div>
    </>
    )
}

export default NavBarButtons