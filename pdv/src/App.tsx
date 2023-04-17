import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import NavBarButtons from '../src/Routes/NavBarButtons/NavBarButtons'
import { LoginScreen } from '../src/Routes/LoginScreen/LoginScreen'
import { SideBar } from './components/SideBar/SideBar'
import { ItemsManager } from './components/ItemsManager/ItemsManager'
import { UsersManager } from './components/UsersManager/UsersManager'
import { useAuthContext } from './utils/contexts/AuthProvider'
import { useItemListContext } from './utils/contexts/ItemsProvider'
import { onSnapshot, doc } from 'firebase/firestore'
import { DOC_PATH, db } from './utils/firebase/firebase'
import { useSalesHistoryContext } from './utils/contexts/SalesHistoryProvider'
import { useSalesContext } from './utils/contexts/SalesProvider'
import { ProblemReportModal } from './components/ProblemReportModal/ProblemReportModal'

function App() {
  const AuthContext = useAuthContext()
  const ItemListContext = useItemListContext()
  const SalesContext = useSalesContext()
  const SalesHistoryContext = useSalesHistoryContext()
  const [darkTheme, setDarkTheme] = useState(false)
  const [sideBar, setSideBar] = useState(false)
  const [itemVisible, setItemVisible] = useState(false);
  const [usersVisible, setUsersVisible] = useState(false);
  const [reportVisible, setReportVisible] = useState(false)
  let location = useLocation()

  const itemHandler = () => {
    if (AuthContext.currentUser.userType == "Padrão") return window.alert("Essa tela é reservada para usuários de nível Gerência e Master.")
    setItemVisible(true)
  };
  const closeItemHandler = () => setItemVisible(false);
  const usersHandler = () => setUsersVisible(true);
  const closeUsersHandler = () => setUsersVisible(false);
  const reportHandler = () => setReportVisible(true);
  const closeReportHandler = () => setReportVisible(false);


  const localStorageManagement = () => {
    let storagedTheme = localStorage.getItem('darkTheme')
    let storageSideBarState = localStorage.getItem('sideBar')
    if (storageSideBarState == "open") setSideBar(true)
    if (storagedTheme == "dark") setDarkTheme(true)
  }

  const setTheme = () => {
    setDarkTheme(theme => !theme)
    if (darkTheme && localStorage.getItem("darkTheme")) return localStorage.removeItem("darkTheme")
    localStorage.setItem("darkTheme", "dark")
  }

  const setSideBarStorage = () => {
    setSideBar(sideBar => !sideBar)
    if (sideBar && localStorage.getItem("sideBar")) return localStorage.removeItem("sideBar")
    localStorage.setItem("sideBar", "open")
  }

  const setSnapShot = () => {
    if (!AuthContext.currentUser.id) return false
    const unsub = onSnapshot(doc(db, DOC_PATH, AuthContext.currentUser.id), (doc) => {
      console.log("teste snap shot: ", doc.data()?.sales)
      SalesContext.setSales(doc.data()?.sales)
      SalesHistoryContext.setSalesHistory(doc.data()?.salesHistory)
      ItemListContext.setItemList(doc.data()?.items)
    });
  }

  useEffect(() => {
    localStorageManagement()
  }, [])

  useEffect(() => {
    setSnapShot()
  }, [AuthContext.currentUser.id])

  return (
    <main className={`main ${darkTheme ? 'darkThemed' : 'lightThemed'}`}>
      <LoginScreen />
      <SideBar sideBar={sideBar} setSideBar={setSideBarStorage} theme={darkTheme} setTheme={setTheme} itemHandler={itemHandler} usersHandler={usersHandler} />
      <ItemsManager visible={itemVisible} closeItemHandler={closeItemHandler} />
      <UsersManager visible={usersVisible} closeUsersHandler={closeUsersHandler} />

      <div className='section'>
        <div className={sideBar == true ? "divContainer side-bar" : "divContainer"}>
          {!["/sales", "/dashboards"].includes(location.pathname) && <NavBarButtons />}
          <Outlet />
        </div>
      </div>
      <button className="message-button" onClick={reportHandler}>
      <i className="bi bi-envelope-exclamation"></i>
      </button>
        <span>Reportar um problema</span>
        <ProblemReportModal visible={reportVisible} closeReportHandler={closeReportHandler} />
    </main>
  )
}

export default App
