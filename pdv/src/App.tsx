import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import './App.css'
import NavBarButtons from '../src/Routes/NavBarButtons/NavBarButtons'
import { LoginScreen } from '../src/Routes/LoginScreen/LoginScreen'
import { SideBar } from './components/SideBar/SideBar'
import { ItemsManager } from './components/ItemsManager/ItemsManager'
import { UsersManager } from './components/UsersManager/UsersManager'
import { useAuthContext } from './utils/contexts/AuthProvider'

function App() {
  const AuthContext = useAuthContext()
  const [darkTheme, setDarkTheme] = useState(false)
  const [sideBar, setSideBar] = useState(false)
  const [itemVisible, setItemVisible] = useState(false);
  const [usersVisible, setUsersVisible] = useState(false);

  const itemHandler = () => {
    if(AuthContext.currentUser.userType == "Padrão") return window.alert("Essa tela é reservada para usuários de nível Gerência e Master.")
    setItemVisible(true)
  };
  const closeItemHandler = () => setItemVisible(false);
  const usersHandler = () => setUsersVisible(true);
  const closeUsersHandler = () => setUsersVisible(false);


  const localStorageManagement = () => {
    let storagedTheme = localStorage.getItem('darkTheme')
    let storageSideBarState = localStorage.getItem('sideBar')
    if(storageSideBarState == "open") setSideBar(true)
    if(storagedTheme == "dark") setDarkTheme(true) 
  }

  const setTheme = () => {
    setDarkTheme(theme => !theme)
    if(darkTheme && localStorage.getItem("darkTheme")) return localStorage.removeItem("darkTheme") 
    localStorage.setItem("darkTheme", "dark")
  }

  const setSideBarStorage = () => {
    setSideBar(sideBar => !sideBar)
    if(sideBar && localStorage.getItem("sideBar")) return localStorage.removeItem("sideBar") 
    localStorage.setItem("sideBar", "open")
  }

  useEffect(() => {
    localStorageManagement()
  }, [])

  return (
    <main className={`main ${darkTheme ? 'darkThemed' : 'lightThemed'}`}>
      <LoginScreen />
      <SideBar sideBar={sideBar} setSideBar={setSideBarStorage} theme={darkTheme} setTheme={setTheme} itemHandler={itemHandler} usersHandler={usersHandler} />
      <ItemsManager visible={itemVisible} closeItemHandler={closeItemHandler} />
      <UsersManager visible={usersVisible} closeUsersHandler={closeUsersHandler} />

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
