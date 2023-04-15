import React, { useEffect, useState } from 'react'
import "./styles.css"
//@ts-ignore
import logo from '../../../src/assets/fav-icon.png'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { Link } from 'react-router-dom'

export const SideBar = (props: any) => {
    const [open, setOpen] = useState(false)
    const AuthContext = useAuthContext()

    const handleSideBar = () => {
        setOpen(!open)
        props.setSideBar(!open)
    }

    const logOut = () => {

    }

    useEffect(() => {
        setOpen(props.sideBar)
    }, [props.sideBar])

    return (
        <section>
            <nav className={open == false ? "sidebar close" : "sidebar"}>
                <header>
                    <div className="image-text">
                        <span className="image">
                            <img src={logo} alt="logo" /> 
                        </span>
                        <div className="div text header-text">
                            <span className="name">Simpls Software</span>
                            <abbr title={AuthContext.currentUser.workplaceName}><span className="workplace">{AuthContext.currentUser.workplaceName}</span></abbr>
                            <abbr title={AuthContext.currentUser.userName}><span className="user">{AuthContext.currentUser.userName}</span></abbr>
                            <span className="user">{AuthContext.currentUser.userType}</span>
                        </div>
                    </div>
                    <span className=" toggle" onClick={handleSideBar}>
                        <i className="bi bi-chevron-right"></i>
                        </span>
                </header>
                <hr />
                <div className="menu-bar">
                    <div className="menu">
                        <ul className="menu-link-list">
                            <li className="nav-link">
                                <Link to="/newsalescreen">
                                    <i className="bi bi-house"></i>
                                    <span className="text nav-text">Início</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Link to="/sales">
                                    <i className="bi bi-currency-dollar"></i>
                                    <span className="text nav-text">Vendas</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Link to="/dashboards">
                                    <i className="bi bi-clipboard-data"></i>
                                    <span className="text nav-text">Dashboards</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <a href="#" onClick={() => props.usersHandler()}>
                                <i className="bi bi-people"></i>
                                    <span className="text nav-text">Gerenciar Usuários</span>
                                </a>
                            </li>
                            <li className="nav-link">
                                <a href="#" onClick={() => props.itemHandler()}>
                                <i className="bi bi-pencil-square"></i>
                                    <span className="text nav-text">Gerenciar Itens</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="bottom-content">
                        <hr />
                        <li className="mode" onClick={() => props.setTheme()}>
                            <div className="moon-sun">
                                <i className="bi bi-moon moon"></i>
                                <i className="bi bi-brightness-high sun"></i>
                            </div>
                            <span className="mode-text text">Tema escuro</span>
                            <div className="toggle-switch">
                                <span className="switch"></span>
                            </div>
                        </li>
                        <li className="" onClick={() => {
                            AuthContext.setCurrentUser({} as typeof AuthContext.currentUser)
                            localStorage.removeItem("loginData")
                        }}>
                            <Link to="/">
                                <i className="bi bi-box-arrow-right"></i>
                                <span className="text nav-text">Sair</span>
                            </Link>
                        </li>
                    </div>
                </div>
            </nav>
        </section>
    )
}