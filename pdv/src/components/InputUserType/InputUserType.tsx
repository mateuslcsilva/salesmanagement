import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useAuthContext } from "../../utils/contexts/AuthProvider.js";
import { useOrderContext } from "../../utils/contexts/OrderContext.js";
import { db } from "../../utils/firebase/firebase.js";
import './styles.css'

export const InputUserType = (props: any) => {
    const [userTypeListActive, setUserTypeListActive] = useState<boolean>(false)
    const [userTypes, setUserTypes] = useState(["Padrão", "Gerencia", "Master"])

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

