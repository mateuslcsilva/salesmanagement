import React, { useContext, useEffect, useState } from 'react'
import { reportType, conversationType } from '../../types/reportProblemTypes'
import { updateDoc, doc, arrayUnion } from 'firebase/firestore'
import { db, DOC_PATH } from '../firebase/firebase'

let initialUserObj = {
    id: '',
    userName: '',
    workplaceName: '',
    userType: ''
}

type typeUserObj = typeof initialUserObj

interface AuthContextData {
    currentUser: typeUserObj,
    setCurrentUser: React.Dispatch<React.SetStateAction<typeUserObj>>
}

interface childrenType {
    children : React.ReactNode
}

const AuthContext = React.createContext({} as AuthContextData)

export const useAuthContext = () => {
    return useContext(AuthContext) 
}

export const AuthProvider = ({ children }: childrenType) => {

    const [currentUser, setCurrentUser] = useState(initialUserObj)

    return (
        <>
            <AuthContext.Provider value={{currentUser, setCurrentUser}}>
                    {children}
            </AuthContext.Provider>
        </>
    )
}