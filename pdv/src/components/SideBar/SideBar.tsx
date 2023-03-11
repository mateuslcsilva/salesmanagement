import React, { useEffect, useState } from 'react'
import "./styles.css"
import logo from '../../assets/fav-icon.png'

export const SideBar = (props: any) => {
    const [open, setOpen] = useState(false)

    const handleSideBar = () => {
        setOpen(!open)
        props.setSideBar(open)
    }

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
                            <span className="profession">Software de Gestão</span>
                        </div>
                    </div>
                    <span className=" toggle" onClick={handleSideBar}>
                        <i className="bi bi-chevron-right"></i>
                        </span>
                </header>
                <div className="menu-bar">
                    <div className="menu">
                        <li className="search-box">
                            <label htmlFor="input-search"><i className="bi bi-search"></i></label>
                            <input type="search" id="input-search" placeholder="Search..."></input>
                        </li>
                        <ul className="menu-link-list">
                            <li className="nav-link">
                                <a href="#">
                                    <i className="bi bi-house"></i>
                                    <span className="text nav-text">Início</span>
                                </a>
                            </li>
                            <li className="nav-link">
                                <a href="#">
                                    <i className="bi bi-currency-dollar"></i>
                                    <span className="text nav-text">Vendas</span>
                                </a>
                            </li>
                            <li className="nav-link">
                                <a href="#">
                                    <i className="bi bi-wallet2"></i>
                                    <span className="text nav-text">Fluxo de Caixa</span>
                                </a>
                            </li>
                            <li className="nav-link">
                                <a href="#">
                                    <i className="bi bi-bar-chart"></i>
                                    <span className="text nav-text">Relatórios de Venda</span>
                                </a>
                            </li>
                            <li className="nav-link">
                                <a href="#">
                                    <i className="bi bi-clipboard-data"></i>
                                    <span className="text nav-text">Dashboards</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="bottom-content">
                        <hr />
                        <li className="mode">
                            <div className="moon-sun">
                                <i className="bi bi-moon moon"></i>
                                <i className="bi bi-brightness-high sun"></i>
                            </div>
                            <span className="mode-text text">Dark Mode</span>
                            <div className="toggle-switch">
                                <span className="switch"></span>
                            </div>
                        </li>
                        <li className="">
                            <a href="#">
                                <i className="bi bi-box-arrow-right"></i>
                                <span className="text nav-text">Sair</span>
                            </a>
                        </li>
                    </div>
                </div>
            </nav>
        </section>
    )
}