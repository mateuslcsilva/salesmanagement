import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { NewSaleScreen } from './Routes/NewSaleScreen/NewSaleScreen'
import { AddSaleScreen } from './Routes/AddSaleScreen/AddSaleScreen';
import { UpdateSaleScreen } from './Routes/UpdateSaleScreen/UpdateSaleScreen';
import { CheckOutScreen } from './Routes/CheckOutScreen/CheckOutScreen';
import { Extract } from './Routes/Extract/Extract'
import { Dashboards  } from './Routes/Dashboards/Dashboards';
import App from './App'
import './index.css'
import '../node_modules/bulma/css/bulma.min.css'
import { AuthProvider } from './utils/contexts/AuthProvider';
import { OrderProvider } from './utils/contexts/OrderContext';
import { Sales } from './Routes/Sales/Sales';

//TODO: FAZER UM CONTEXT PRA TRAZER OS SEGUINTES DADOS PRA CÁ: ID, DADOS DE USUÁRIO
 
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <OrderProvider >
      <BrowserRouter >
        <Routes>
          <Route path='/' element={<Navigate to='/newsalescreen' replace={true} />}></Route>
          <Route path='/' element={<App />}>
            <Route path='/newsalescreen' element={<NewSaleScreen />}></Route>
            <Route path='/addsalescreen' element={<AddSaleScreen />}></Route>
            <Route path='/updatesalescreen' element={<UpdateSaleScreen />}></Route>
            <Route path='/checkoutscreen' element={<CheckOutScreen />}></Route>
            <Route path='/extract' element={<Extract />}></Route>
          <Route path='/dashboards' element={ <Dashboards />}></Route>
          <Route path='/sales' element={ <Sales />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
      </OrderProvider>
    </AuthProvider>
  </React.StrictMode>
)