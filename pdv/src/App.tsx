import React from 'react'
import {Outlet} from 'react-router-dom'
import './App.css'

import NavBarButtons from '../src/Routes/NavBarButtons/NavBarButtons'

function App() {


  return (
    <>
      <section className='section'>
        <div className='divContainer'>
          <NavBarButtons />
          <Outlet /> 
        </div>
      </section>
    </>
  )
}

export default App
