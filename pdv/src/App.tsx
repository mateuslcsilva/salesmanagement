import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import './App.css'
import NavBarButtons from '../src/Routes/NavBarButtons/NavBarButtons'
import { Fab, ThemeProvider } from '@mui/material'

function App() {

  const [theme, setTheme] = useState('lightThemed')

  useEffect(() => {
    setTheme(localStorage.getItem('theme') ? )
  }, [])


  return (
    <body className={theme}>
      <Fab  
      aria-label="add" 
      className='mt-2 ml-2' 
      onClick={theme == 'lightThemed' ? 
      () => {setTheme('darkThemed'); localStorage.setItem('theme', theme)} 
      : 
      () => {setTheme('lightThemed'); localStorage.setItem('theme', theme)} }
      >
      {
      theme != 'lightThemed' ? 
      <i className="bi bi-brightness-high title is-4 mt-5"></i> 
      : 
      <i className="bi bi-moon-fill"></i>
      }
      </Fab>

      <section className='section'>
        <div className='divContainer'>
          <NavBarButtons />
          <Outlet />
        </div>



      </section>


    </body>
  )
}

export default App
