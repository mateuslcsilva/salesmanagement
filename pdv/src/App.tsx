import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import './App.css'
import NavBarButtons from '../src/Routes/NavBarButtons/NavBarButtons'
import { LoginScreen } from '../src/Routes/LoginScreen/LoginScreen'
import { Fab, ThemeProvider } from '@mui/material'

function App() {

  const [theme, setTheme] = useState('lightThemed')


  const localStorageManagement = () => {
    let storagedTheme = localStorage.getItem('theme')
    setTheme(storagedTheme ? storagedTheme : 'lightThemed')
  }

  useEffect(() => {
    let storagedTheme = localStorage.getItem('theme')
    setTheme(storagedTheme ? storagedTheme : 'lightThemed')
  }, [])

  return (
    <main className={theme}>
      <LoginScreen />
      <Fab
        aria-label="add"
        className='mt-2 ml-2'
        onClick={theme == 'lightThemed' ?
          () => { setTheme('darkThemed'); localStorage.setItem('theme', 'darkThemed') }
          : //TERNARY ALERT!!!
          () => { setTheme('lightThemed'); localStorage.setItem('theme', 'lightThemed') }}
      >
        {
          theme != 'lightThemed' ?
            <i className="bi bi-brightness-high title is-4 mt-5"></i>
            : //TERNARY ALERT!!!
            <i className="bi bi-moon-fill"></i>
        }
      </Fab>

      <section className='section'>
        <div className='divContainer'>
          <NavBarButtons />
          <Outlet />
        </div>
      </section>
    </main>
  )
}

export default App
