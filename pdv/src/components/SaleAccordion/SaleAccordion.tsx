import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '../Button/Button';

export default function SaleAccordion(props :any) {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };



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
            <Typography sx={{ color: 'text.secondary' }}>{'Comanda: ' + sale.numSale + '  |  ' + (sale.costumerName? ('Cliente: ' + sale.costumerName) : '')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {sale.orders.map((item: String) => <p>{item}</p>)}
            </Typography>
            <div className='is-flex is-justify-content-flex-end'>
            <Typography>
              <Button text={<i className="bi bi-box-arrow-up title is-4 has-text-white"></i>} className={'is-info'} onClick={() => props.selectedSale(sale)}/>
            </Typography>
            </div>
          </AccordionDetails>
        </Accordion>
        )
      })}
    </div>
  );
}