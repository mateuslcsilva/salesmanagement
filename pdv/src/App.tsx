import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import './App.css'
import NavBarButtons from '../src/Routes/NavBarButtons/NavBarButtons'
import { LoginScreen } from '../src/Routes/LoginScreen/LoginScreen'
import { Fab, ThemeProvider } from '@mui/material'
import { SideBar } from './components/SideBar/SideBar'

function App() {
  const [darkTheme, setDarkTheme] = useState(true)
  const [sideBar, setSideBar] = useState(false)


  const localStorageManagement = () => {
    let storagedTheme = localStorage.getItem('theme')
    if(storagedTheme) setDarkTheme(true) 
  }

  const setTheme = () => {
    console.log("here")
    setDarkTheme(theme => !theme)
  }

  useEffect(() => {
    localStorageManagement()
  }, [])

  return (
    <main className={`main ${darkTheme ? 'darkThemed' : 'lightThemed'}`}>
      <LoginScreen />
      <SideBar setSideBar={setSideBar} theme={darkTheme} setTheme={() => setTheme} />

      <div className='section'>
        <div className={sideBar == true ? "divContainer side-bar" : "divContainer"}>
          <NavBarButtons />
          <Outlet />
        </div>
      </div>
    </main>
  )
}

export default App
