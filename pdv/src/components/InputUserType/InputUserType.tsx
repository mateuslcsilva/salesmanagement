import React, { useContext, useEffect, useState } from "react";
import { useAuthContext } from "../../utils/contexts/AuthProvider.js";
import './styles.css'

export const InputUserType = (props: any) => {
    const AuthContext = useAuthContext()
    const [userTypeListActive, setUserTypeListActive] = useState<boolean>(false)
    const [userTypes, setUserTypes] = useState<Array<string>>([""])

    useEffect(() => {
        let userType = AuthContext.currentUser.userType
        if(userType.toLocaleLowerCase() == "padrão") setUserTypes(["", "Padrão"])
        if(userType.toLocaleLowerCase() == "gerencia") setUserTypes(["", "Padrão", "Gerencia"])
        if(userType.toLocaleLowerCase() == "master") setUserTypes(["", "Padrão", "Gerencia", "Master"])
    }, [AuthContext.currentUser.id])

    useEffect(() => {
        setUserTypeListActive(false)
    }, [props.disabled])

    const getUserType = (e :React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        props.handleUserInfoChange(e)
        setUserTypeListActive(false)
    }

    return (
        <section>
            <div
                className={`userTypesInput ${props.className} ${userTypeListActive || props.userInfo.userType ? "active-input" : ""}`}
                placeholder={props.placeholder}
                onChange={props.onChange}
                onClick={() => setUserTypeListActive(userTypeListActive => !userTypeListActive)}
            >
                <p>{props.userInfo.userType || "Tipo de Usuário"}</p>
            </div>

            <div id='userTypeList' className={userTypeListActive? "active primary-text" : "primary-text"}>
                {userTypes.map((userType: string, index: number): any => {
                    return (
                        <input 
                        type="button"
                        className="user-type-button" 
                        key={index} 
                        name="userType"
                        value={userType}
                        onClick={(e) => getUserType(e)}
                        />
                    )
                })}
            </div>
        </section>
    )
}

