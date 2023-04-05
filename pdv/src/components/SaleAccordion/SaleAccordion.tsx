import React, { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '../Button/Button';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthContext } from '../../utils/contexts/AuthProvider';
import { useOrderContext } from '../../utils/contexts/OrderContext';
import { db } from '../../utils/firebase/firebase';

export default function SaleAccordion(props :any) {

  const [expanded, setExpanded] = useState<string | false>(false);
  const [itemList, setItemList] = useState<itemType[]>([])
  const AuthContext = useAuthContext()
  const orderContext = useOrderContext()

  interface itemType {
      numItem: number;
      item: string;
      itemValue: string
  }

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

     const getItems = async () => {
        if (AuthContext.currentUser.id == '') return false
        let docRef = doc(db, "empresas", `${AuthContext.currentUser.id}`)
        let data = await getDoc(docRef)
            .then(res => res.data()?.items)
        setItemList(data)
    }

    const getItemText = (typeParam: string, value: number | undefined) => {
        if (AuthContext.currentUser.id == '') return
        if (!value) return
        if (typeParam == "numItem") {
            let index = itemList.findIndex((item :itemType) => item.numItem == value)
            //@ts-ignore
            let text = (itemList[index]?.numItem < 10 ? '0' + itemList[index]?.numItem : itemList[index]?.numItem.toString()) + ' - ' + itemList[index]?.item + '- ' + itemList[index]?.itemValue.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
            return text
        }
        if (!itemList[value]) return ''
        if (typeParam == "index") {
          //@ts-ignore
            let text = (itemList[value]?.numItem < 10 ? '0' + itemList[value]?.numItem : itemList[value]?.numItem.toString()) + ' - ' + itemList[value]?.item + ' - ' + itemList[value]?.itemValue.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
            return text
        }
    }

    useEffect(() => {
      getItems()
    }, [])



  return (
    <div>
      {props.sale.map((sale: any, index: number) => {
        const indexof = index++
        return(
          <Accordion expanded={expanded === ('panel' + ((indexof).toString()))} onChange={handleChange('panel' + ((indexof).toString()))} key={indexof}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={"panel" + ((indexof).toString()) + "bh-content"}
            id={"panel" + ((indexof).toString()) + "bh-header"}
          >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>
            {'Mesa: ' + sale.numTable}
              
            </Typography>
            <Typography    sx={{ color: 'text.secondary' }}>{'Comanda: ' + sale.numSale + '  |  ' + (sale.costumerName? ('Cliente: ' + sale.costumerName) : '')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {sale.orders.map((item :number) => <p>{getItemText("numItem", item)}</p>)}
              <p className='mt-3 title is-5' style={{'textAlign' : 'end'}}> Total: {sale.totalValue.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</p>
            </Typography>
            <div className='is-flex is-justify-content-flex-end'>
            <Typography>
              {
              !props.hiddeButton && 
              <Button 
              text={<i className="bi bi-box-arrow-up title is-4 has-text-white"></i>} 
              className={'is-info mt-2'} 
              onClick={() => {
                props.selectedSale(sale)
                if(props.selectedIndex){
                  props.selectedIndex(--index)
                }
              }}
              />}
            </Typography>
            </div>
          </AccordionDetails>
        </Accordion>
        )
      })}
    </div>
  );
}