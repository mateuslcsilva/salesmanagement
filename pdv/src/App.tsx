import { useState } from 'react'
import './App.css'
import NavBarButtons from '../src/components/NavBarButtons/NavBarButtons'
import NewSaleScreen from '../src/components/NewSaleScreen/NewSaleScreen'

function App() {


  return (
    <>
      <section className='section'>
        <div className='divContainer'>
          <NavBarButtons />
          <NewSaleScreen />
        </div>
      </section>
    </>
  )
}

export default App
